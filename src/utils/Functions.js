const getEstimatedFare =  function (cat_id,Est_Fare_List) {
    // console.log(cat_id,"called",Est_Fare_List,Est_Fare_List[2])
    const fare = Est_Fare_List[cat_id]?.trip_pay_amount
    return fare ;
};


  // Format timestamp
 export const  formatTimestamp = function (isoTimestamp) {
    if (!isoTimestamp) return "Invalid Timestamp";
    const date = new Date(isoTimestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

// module.exports = {
//     getEstimatedFare,
//     formatTimestamp,
// };