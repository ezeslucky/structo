/*
  Forked from https://github.com/vercel/commerce/tree/main/packages/saleor/src
  Changes: None
*/

export const CheckoutDetails = /* GraphQL */ `
  fragment CheckoutDetails on Checkout {
    id
    token
    created
    totalPrice {
      currency
      gross {
        amount
      }
    }
    subtotalPrice {
      currency
      gross {
        amount
      }
    }

    lines {
      id
      variant {
        id
        name
        sku
        product {
          name
          slug
          id
        }
        media {
          url
        }
        pricing {
          price {
            gross {
              amount
            }
          }
        }
      }
      quantity
      totalPrice {
        currency
        gross {
          amount
        }
      }
    }
  }
`;
