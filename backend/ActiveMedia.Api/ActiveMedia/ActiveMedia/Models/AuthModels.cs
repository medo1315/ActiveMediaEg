using System.Text.Json.Serialization;

namespace ActiveMedia.Api.Models;

public record LoginRequest(
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("password")] string Password
);

public record AuthSession(
    [property: JsonPropertyName("access_token")] string AccessToken,
    [property: JsonPropertyName("user")] UserDto User
);

public record UserDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("permissions")] List<string> Permissions
);

public record AuthResponse(
    [property: JsonPropertyName("session")] AuthSession? Session,
    [property: JsonPropertyName("error")] string? Error
);
