namespace CVBuilder.Contracts.Auth;

public interface IOAuthProviderFactory
{
    /// <summary>
    /// Gets an OAuth provider instance by type
    /// </summary>
    IOAuthProvider GetProvider(OAuthProviderType providerType);
    
    /// <summary>
    /// Gets all available providers
    /// </summary>
    IEnumerable<OAuthProviderType> GetAvailableProviders();
    
    /// <summary>
    /// Validates if a provider is configured and available
    /// </summary>
    bool IsProviderAvailable(OAuthProviderType providerType);
}