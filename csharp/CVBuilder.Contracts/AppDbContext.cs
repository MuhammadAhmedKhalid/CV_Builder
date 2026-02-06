using CVBuilder.Contracts;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<EfItem<User>> Users => Set<EfItem<User>>();
    public DbSet<EfItem<UserIdentity>> UserIdentities => Set<EfItem<UserIdentity>>();
    public DbSet<EfItem<CvTemplate>> CvTemplates => Set<EfItem<CvTemplate>>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EfItem<User>>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content)
                  .HasColumnType("jsonb");
            entity.ToTable("Users"); 
            entity.Metadata.SetIsTableExcludedFromMigrations(true); 
        });

        modelBuilder.Entity<EfItem<UserIdentity>>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content)
                  .HasColumnType("jsonb");
            
            // Create index on UserId for faster lookups
            entity.HasIndex(e => e.Content)
                  .HasMethod("gin")
                  .HasOperators("jsonb_path_ops");
        });

        modelBuilder.Entity<EfItem<CvTemplate>>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content)
                  .HasColumnType("jsonb");
            entity.ToTable("CvTemplates");
        });
    }
}