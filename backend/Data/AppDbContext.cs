using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductAttribute> ProductAttributes { get; set; }
    public DbSet<ProductRecommendation> ProductRecommendations { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Settings> Settings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure ProductRecommendation relationships
        modelBuilder.Entity<ProductRecommendation>()
            .HasOne(pr => pr.Product)
            .WithMany()
            .HasForeignKey(pr => pr.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductRecommendation>()
            .HasOne(pr => pr.RecommendedProduct)
            .WithMany()
            .HasForeignKey(pr => pr.RecommendedProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Review relationships to avoid multiple cascade paths
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Order relationships
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Cart uniqueness
        modelBuilder.Entity<Cart>()
            .HasIndex(c => c.UserId)
            .IsUnique();

        // Configure Wishlist uniqueness
        modelBuilder.Entity<Wishlist>()
            .HasIndex(w => w.UserId)
            .IsUnique();

        // Configure WishlistItem uniqueness (composite key)
        modelBuilder.Entity<WishlistItem>()
            .HasIndex(wi => new { wi.WishlistId, wi.ProductId })
            .IsUnique();

        // Configure Default Values
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
            entity.Property(u => u.IsActive).HasDefaultValue(true);
            entity.Property(u => u.Role).HasDefaultValue("Customer");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(c => c.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
            entity.Property(p => p.UpdatedAt).HasDefaultValueSql("SYSDATETIME()");
            entity.Property(p => p.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(o => o.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
            entity.Property(o => o.Status).HasDefaultValue("Pending");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(p => p.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
            entity.Property(p => p.Status).HasDefaultValue("Pending");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.Property(c => c.CreatedAt).HasDefaultValueSql("SYSDATETIME()");
        });
    }
}
