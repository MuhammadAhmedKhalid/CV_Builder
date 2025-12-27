using CVBuilder.Contracts;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<EfItem<User>> Users => Set<EfItem<User>>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EfItem<User>>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content)
                  .HasColumnType("jsonb");
        });
    }
}