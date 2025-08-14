/*
  Forked from https://github.com/vercel/commerce/tree/main/packages/saleor/src
  Changes: None 
*/

export const getSortVariables = (sort?: string, isCategory: boolean = false) => {
  let output = {}
  switch (sort) {
    case 'price-asc':
      output = {
        field: 'PRICE',
        direction: 'ASC',
      }
      break
    case 'price-desc':
      output = {
        field: 'PRICE',
        direction: 'DESC',
      }
      break
    case 'trending-desc': //default
      output = {} 
      break
    case 'latest-desc':
      output = {
        field: 'DATE',
        direction: 'DESC',
      }
      break
  }
  return output
}
