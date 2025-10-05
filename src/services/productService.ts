import PRODUCT_LIST_DUMMY from "@/data/DUMMY_PRODUCT";
import type { ProductListResponse } from "@/types/product";

// Dummy data service that simulates API responses
export class ProductService {
  private static dummyData: ProductListResponse = PRODUCT_LIST_DUMMY;

  // Simulate API call with delay
  static async getProducts(
    page: number = 1,
    perPage: number = 10
  ): Promise<ProductListResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return paginated data
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = this.dummyData.data.data.slice(startIndex, endIndex);

    function transformToTreeData(products: any[]): any[] {
      return products.map((product) => {
        // If product has variants, add them as children
        if (
          product.has_variant &&
          product.variant &&
          product.variant.length > 0
        ) {
          return {
            ...product,
            children: product.variant.map((variant: any) => ({
              ...variant,
              // Mark as variant for styling purposes
              isVariant: true,
              // Use parent's category if variant doesn't have one
              category: variant.category || product.category,
              // Inherit parent's updated_at if variant doesn't have one
              updated_at: variant.updated_at || product.updated_at,
            })),
          };
        }
        return product;
      });
    }

    const treeData = transformToTreeData(paginatedData);

    return {
      ...this.dummyData,
      data: {
        ...this.dummyData.data,
        current_page: page,
        data: treeData,
        from: startIndex + 1,
        to: Math.min(endIndex, this.dummyData.data.data.length),
        per_page: perPage,
        last_page: Math.ceil(this.dummyData.data.data.length / perPage),
      },
    };
  }
}
