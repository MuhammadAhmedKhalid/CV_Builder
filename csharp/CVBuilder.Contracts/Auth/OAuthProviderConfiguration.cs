namespace CVBuilder.Contracts.Auth;

public class OAuthProviderConfiguration
{
    public OAuthProviderType ProviderType { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string AuthorizationEndpoint { get; set; } = string.Empty;
    public string TokenEndpoint { get; set; } = string.Empty;
    public string UserInfoEndpoint { get; set; } = string.Empty;
    public string[] DefaultScopes { get; set; } = Array.Empty<string>();
    public bool Enabled { get; set; } = true;
}