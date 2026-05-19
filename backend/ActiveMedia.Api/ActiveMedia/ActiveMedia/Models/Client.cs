using System.Text.Json.Serialization;

namespace ActiveMedia.Api.Models;

public class Client
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("logo_url")]
    public string? LogoUrl { get; set; }

    [JsonPropertyName("manager_name")]
    public string? ManagerName { get; set; }

    [JsonPropertyName("testimonial_text")]
    public string? TestimonialText { get; set; }

    [JsonPropertyName("testimonial_role")]
    public string? TestimonialRole { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
