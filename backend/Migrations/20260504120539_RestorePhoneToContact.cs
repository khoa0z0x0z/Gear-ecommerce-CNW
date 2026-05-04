using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RestorePhoneToContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Index may not exist on all environments, skip if missing
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM sys.indexes
                    WHERE name = 'IX_WishlistItems_WishlistId'
                    AND object_id = OBJECT_ID('WishlistItems')
                )
                DROP INDEX [IX_WishlistItems_WishlistId] ON [WishlistItems];
            ");

            // Column Phone may already exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT * FROM sys.columns 
                    WHERE Name = N'Phone' AND Object_ID = Object_ID(N'Contacts')
                )
                BEGIN
                    ALTER TABLE Contacts ADD Phone nvarchar(50) NULL;
                END
            ");

            // Create new index conditionally
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT * FROM sys.indexes 
                    WHERE name = 'IX_WishlistItems_WishlistId_ProductId' AND object_id = OBJECT_ID('WishlistItems')
                )
                BEGIN
                    CREATE UNIQUE INDEX [IX_WishlistItems_WishlistId_ProductId] ON [WishlistItems] ([WishlistId], [ProductId]);
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WishlistItems_WishlistId_ProductId",
                table: "WishlistItems");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Contacts");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItems_WishlistId",
                table: "WishlistItems",
                column: "WishlistId");
        }
    }
}
