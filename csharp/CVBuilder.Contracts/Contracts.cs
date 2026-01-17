namespace CVBuilder.Contracts
{
    public class UserContract
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLoginAt { get; set; }
        public List<UserIdentityContract> Identities { get; set; } = new();
    }

    public class UserIdentityContract
    {
        public string ProviderType { get; set; }
        public string ProviderUserId { get; set; }
        public string? ProviderEmail { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderPicture { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUsedAt { get; set; }
        public bool IsActive { get; set; }
    }
}