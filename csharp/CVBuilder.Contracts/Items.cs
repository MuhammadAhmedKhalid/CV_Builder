using CVBuilder.Contracts.Auth;

namespace CVBuilder.Contracts
{
    public class User : DbItem
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; } // filename only
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;

        // TO / FROM methods for API contract mapping
        public static User FromContract(UserContract contract)
        {
            return new User
            {
                UserId = contract.UserId,
                Email = contract.Email,
                Name = contract.Name,
                Picture = contract.Picture,
                CreatedAt = contract.CreatedAt,
                LastLoginAt = contract.LastLoginAt
            };
        }

        public UserContract ToContract()
        {
            return new UserContract
            {
                UserId = this.UserId,
                Email = this.Email,
                Name = this.Name,
                Picture = this.Picture,
                CreatedAt = this.CreatedAt,
                LastLoginAt = this.LastLoginAt
            };
        }
    }

    public class UserIdentity : DbItem
    {
        public string UserId { get; set; } // Foreign key to User
        public OAuthProviderType ProviderType { get; set; }
        public string ProviderUserId { get; set; } // Unique ID from the provider
        public string? ProviderEmail { get; set; } // Email from provider (may differ from user email)
        public string? ProviderName { get; set; } // Name from provider
        public string? ProviderPicture { get; set; } // Picture URL from provider
        public string? AccessToken { get; set; } // Encrypted access token
        public string? RefreshToken { get; set; } // Encrypted refresh token
        public DateTime TokenExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}