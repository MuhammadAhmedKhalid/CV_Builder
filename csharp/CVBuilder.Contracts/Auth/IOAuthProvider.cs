namespace CVBuilder.Contracts.Auth;

public enum OAuthProviderType
{
    Google = 1,
    Auth0 = 2,
    Microsoft = 3,
    GitHub = 4
}

public interface IOAuthProvider
{
    OAuthProviderType ProviderType { get; }
    string Name { get; }
    
    /// <summary>
    /// Validates the OAuth token and returns standardized user information
    /// </summary>
    Task<OAuthUserInfo> ValidateTokenAsync(string token);
    
    /// <summary>
    /// Gets the authorization URL for the OAuth flow
    /// </summary>
    string GetAuthorizationUrl(string state, string redirectUri, string[] scopes);
    
    /// <summary>
    /// Exchanges authorization code for access token
    /// </summary>
    Task<string> ExchangeCodeForTokenAsync(string code, string redirectUri);
}

public class OAuthUserInfo
{
    public string ProviderUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
    public string? Locale { get; set; }
    public string? TimeZone { get; set; }
    public bool EmailVerified { get; set; }
    public Dictionary<string, object> RawClaims { get; set; } = new();
}