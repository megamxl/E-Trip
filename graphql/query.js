import gql from 'graphql-tag';

export const carDataQuery = gql`
query carListSearch {
  carList(search: "Tesla") {
    id
    naming {
      chargetrip_version
      edition
      make
      model
      version
    }
    # add more fields here
  }
}
`

console.log("here")
console.log(carDataQuery)
