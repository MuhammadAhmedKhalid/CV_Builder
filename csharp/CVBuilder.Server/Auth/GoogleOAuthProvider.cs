using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace CVBuilder.Server.Auth;

public class GoogleOAuthProvider : IOAuthProvider
{
    private readonly string _clientId;
    private readonly string _clientSecret;

    public OAuthProviderType ProviderType => OAuthProviderType.Google;
    public string Name => "Google";

    public GoogleOAuthProvider(IConfiguration configuration)
    {
        _clientId = configuration["OAuth:Google:ClientId"] ?? 
                   Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? 
                   throw new InvalidOperationException("Google Client ID is not configured");

        _clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ??
                       throw new InvalidOperationException("Google Client Secret is not configured in environment variables");
    }

    public async Task<OAuthUserInfo> ValidateTokenAsync(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = [_clientId]
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

        return new OAuthUserInfo
        {
            ProviderUserId = payload.Subject,
            Email = payload.Email,
            Name = payload.Name,
            Picture = payload.Picture ?? "",
            Locale = payload.Locale,
            EmailVerified = payload.EmailVerified,
            RawClaims = new Dictionary<string, object>
            {
                ["iss"] = payload.Issuer,
                ["aud"] = payload.Audience,
                ["exp"] = payload.ExpirationTimeSeconds,
                ["iat"] = payload.IssuedAtTimeSeconds
            }
        };
    }

    public string GetAuthorizationUrl(string state, string redirectUri, string[] scopes)
    {
        var defaultScopes = new[] { "openid", "email", "profile" };
        var allScopes = scopes.Length > 0 ? scopes.Concat(defaultScopes).Distinct() : defaultScopes;
        
        var parameters = new List<string>
        {
            $"client_id={Uri.EscapeDataString(_clientId)}",
            $"redirect_uri={Uri.EscapeDataString(redirectUri)}",
            $"response_type=code",
            $"scope={Uri.EscapeDataString(string.Join(" ", allScopes))}",
            $"state={Uri.EscapeDataString(state)}",
            "access_type=offline",
            "prompt=consent"
        };

        return $"https://accounts.google.com/o/oauth2/v2/auth?{string.Join("&", parameters)}";
    }

    public async Task<string> ExchangeCodeForTokenAsync(string code, string redirectUri)
    {
        using var httpClient = new HttpClient();
        
        var parameters = new Dictionary<string, string>
        {
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["code"] = code,
            ["grant_type"] = "authorization_code",
            ["redirect_uri"] = redirectUri
        };

        var response = await httpClient.PostAsync(
            "https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(parameters));

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var tokenResponse = System.Text.Json.JsonDocument.Parse(content);
        
        return tokenResponse.RootElement.GetProperty("access_token").GetString() 
               ?? throw new InvalidOperationException("Failed to obtain access token");
    }
}