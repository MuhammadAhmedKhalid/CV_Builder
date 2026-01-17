using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using Microsoft.Extensions.Configuration;

namespace CVBuilder.Server.Auth;

public class OAuthProviderFactory : IOAuthProviderFactory
{
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;
    private readonly Dictionary<OAuthProviderType, IOAuthProvider> _providers;

    public OAuthProviderFactory(IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _configuration = configuration;
        _serviceProvider = serviceProvider;
        _providers = new Dictionary<OAuthProviderType, IOAuthProvider>();
        
        InitializeProviders();
    }

    private void InitializeProviders()
    {
        // Initialize Google provider if configured
        if (IsProviderConfigured(OAuthProviderType.Google))
        {
            var googleProvider = new GoogleOAuthProvider(_configuration);
            _providers[OAuthProviderType.Google] = googleProvider;
        }

        // Initialize Auth0 provider if configured
        if (IsProviderConfigured(OAuthProviderType.Auth0))
        {
            var auth0Provider = new Auth0OAuthProvider(_configuration);
            _providers[OAuthProviderType.Auth0] = auth0Provider;
        }

        // Add future providers here
        // if (IsProviderConfigured(OAuthProviderType.Microsoft))
        // {
        //     _providers[OAuthProviderType.Microsoft] = new MicrosoftOAuthProvider(_configuration);
        // }
    }

    public IOAuthProvider GetProvider(OAuthProviderType providerType)
    {
        if (!_providers.TryGetValue(providerType, out var provider))
        {
            throw new NotSupportedException($"OAuth provider '{providerType}' is not configured or supported.");
        }

        return provider;
    }

    public IEnumerable<OAuthProviderType> GetAvailableProviders()
    {
        return _providers.Keys;
    }

    public bool IsProviderAvailable(OAuthProviderType providerType)
    {
        return _providers.ContainsKey(providerType);
    }

    private bool IsProviderConfigured(OAuthProviderType providerType)
    {
        var configKey = $"OAuth:{providerType}:ClientId";
        var clientId = _configuration[configKey];
        
        return !string.IsNullOrEmpty(clientId);
    }
}