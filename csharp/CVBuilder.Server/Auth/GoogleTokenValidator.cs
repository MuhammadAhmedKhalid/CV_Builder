using Google.Apis.Auth;

namespace CVBuilder.Server.Auth;

public class GoogleTokenValidator
{
    private readonly string _clientId;

    public GoogleTokenValidator(string clientId)
    {
        _clientId = clientId;
    }

    /// <summary>
    /// Validates the Google ID token and returns the payload if valid.
    /// Throws an exception if invalid.
    /// </summary>
    public async Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = [_clientId]
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        return payload;
    }
}