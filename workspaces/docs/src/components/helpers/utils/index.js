export const asyncTestForm = ({ values }) =>
  new Promise((resolve, reject) => {
    // it could be an API call or any async operation
    setTimeout(() => {
      if (!values || !values.a || !values.b) {
        reject("Emtpy values are not allowed ");
      }
      if (values.a + values.b >= 5) {
        reject("The sum must be less than '5'");
      } else {
        resolve("Success");
      }
    }, 1000);
  });

export const asyncTestInput = value =>
  new Promise((resolve, reject) => {
    // it could be an API call or any async operation
    setTimeout(() => {
      if (value === "foo") {
        reject("username already in use");
      } else {
        resolve("Success");
      }
    }, 1000);
  });
