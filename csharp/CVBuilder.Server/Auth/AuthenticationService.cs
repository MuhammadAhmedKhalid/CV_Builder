using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using Microsoft.EntityFrameworkCore;

namespace CVBuilder.Server.Auth;

public class AuthenticationService
{
    private readonly AppDbContext _db;
    private readonly IOAuthProviderFactory _providerFactory;
    private readonly JwtService _jwtService;

    public AuthenticationService(AppDbContext db, IOAuthProviderFactory providerFactory, JwtService jwtService)
    {
        _db = db;
        _providerFactory = providerFactory;
        _jwtService = jwtService;
    }

    /// <summary>
    /// Authenticates a user using OAuth token and returns JWT token with user info
    /// </summary>
    public async Task<AuthenticationResult> AuthenticateAsync(OAuthProviderType providerType, string token)
    {
        var provider = _providerFactory.GetProvider(providerType);
        var userInfo = await provider.ValidateTokenAsync(token);

        // Find existing user identity
        var efIdentities = new EfTable<UserIdentity>(_db);
        var existingIdentity = await efIdentities.GetItemOrDefaultAsync(
            i => i.ProviderType == providerType && i.ProviderUserId == userInfo.ProviderUserId && i.IsActive);

        User user;

        if (existingIdentity != null)
        {
            // User exists, update identity and user info
            var efUsers = new EfTable<User>(_db);
            user = await efUsers.GetItemOrDefaultAsync(u => u.UserId == existingIdentity.UserId);

            if (user == null)
            {
                throw new InvalidOperationException($"User {existingIdentity.UserId} not found but identity exists");
            }

            // Update user info with latest from provider
            UpdateUserFromProvider(user, userInfo);
            user.LastLoginAt = DateTime.UtcNow;

            // Update identity
            existingIdentity.LastUsedAt = DateTime.UtcNow;
            existingIdentity.ProviderEmail = userInfo.Email;
            existingIdentity.ProviderName = userInfo.Name;
            existingIdentity.ProviderPicture = userInfo.Picture;

            await efUsers.ReplaceItemAsync(user);
            await efIdentities.ReplaceItemAsync(existingIdentity);
        }
        else
        {
            // Check if user exists with same email (merge accounts)
            var efUsers = new EfTable<User>(_db);
            user = await efUsers.GetItemOrDefaultAsync(u => u.Email.Equals(userInfo.Email, StringComparison.OrdinalIgnoreCase));

            if (user != null)
            {
                // Merge accounts - add new identity to existing user
                var newIdentity = new UserIdentity
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = user.UserId,
                    ProviderType = providerType,
                    ProviderUserId = userInfo.ProviderUserId,
                    ProviderEmail = userInfo.Email,
                    ProviderName = userInfo.Name,
                    ProviderPicture = userInfo.Picture,
                    CreatedAt = DateTime.UtcNow,
                    LastUsedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await efIdentities.CreateItemAsync(newIdentity);
                user.LastLoginAt = DateTime.UtcNow;
                await efUsers.ReplaceItemAsync(user);
            }
            else
            {
                // Create new user and identity
                user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = Guid.NewGuid().ToString(),
                    Email = userInfo.Email,
                    Name = userInfo.Name,
                    Picture = userInfo.Picture,
                    CreatedAt = DateTime.UtcNow,
                    LastLoginAt = DateTime.UtcNow
                };

                await efUsers.CreateItemAsync(user);

                var identity = new UserIdentity
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = user.UserId,
                    ProviderType = providerType,
                    ProviderUserId = userInfo.ProviderUserId,
                    ProviderEmail = userInfo.Email,
                    ProviderName = userInfo.Name,
                    ProviderPicture = userInfo.Picture,
                    CreatedAt = DateTime.UtcNow,
                    LastUsedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await efIdentities.CreateItemAsync(identity);
            }
        }

        // Generate JWT token
        var jwtToken = _jwtService.GenerateToken(user.UserId, user.Email, user.Name);

        // Get all user identities for response
        var identities = await GetUserIdentityContractsAsync(user.UserId);

        return new AuthenticationResult
        {
            Token = jwtToken,
            User = new UserContract
            {
                UserId = user.UserId,
                Email = user.Email,
                Name = user.Name,
                Picture = user.Picture,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                Identities = identities
            }
        };
    }

    private void UpdateUserFromProvider(User user, OAuthUserInfo userInfo)
    {
        // Only update if provider info is more recent or complete
        if (string.IsNullOrEmpty(user.Name) || !string.IsNullOrEmpty(userInfo.Name))
        {
            user.Name = userInfo.Name;
        }

        if (string.IsNullOrEmpty(user.Picture) || !string.IsNullOrEmpty(userInfo.Picture))
        {
            user.Picture = userInfo.Picture;
        }
    }

    private async Task<List<UserIdentityContract>> GetUserIdentityContractsAsync(string userId)
    {
        var efIdentities = new EfTable<UserIdentity>(_db);
        var allIdentities = await efIdentities.GetItemsAsync();
        var identities = allIdentities
            .Where(e => e.Content.UserId == userId && e.Content.IsActive)
            .Select(e => e.Content);

        return identities.Select(i => new UserIdentityContract
        {
            ProviderType = i.ProviderType.ToString(),
            ProviderUserId = i.ProviderUserId,
            ProviderEmail = i.ProviderEmail,
            ProviderName = i.ProviderName,
            ProviderPicture = i.ProviderPicture,
            CreatedAt = i.CreatedAt,
            LastUsedAt = i.LastUsedAt,
            IsActive = i.IsActive
        }).ToList();
    }
}

public class AuthenticationResult
{
    public string Token { get; set; } = string.Empty;
    public UserContract User { get; set; } = new();
}