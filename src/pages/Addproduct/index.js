import * as yup from "yup";
import { useFormik, FormikProvider, Form } from "formik";

const schema = yup.object().shape({
  product_name: yup
    .string()
    .required("Name required")
    .min(5, "Name must be atleast 5 character long")
    .max(10, "Name must be upto 10 characters"),
  price: yup
    .number()
    .required("Please provide price")
    .positive("price must be positive")
    .typeError("Invalid price"),
  discount_type: yup.string().oneOf(["fixed", "percentage"], "Invalid value"),

  /**
   * Discount amount is a dependable field
   * if discount type is fixed then amount must be less than product price
   * if discount type is percentage amount must be in between 0-100
   *  */

  discount_amount: yup
    .number()
    .positive("Discount must be positive")
    .typeError("invalid")
    .max(yup.ref("price"), "Discount must be less than price")
    .when("discount_type", {
      is: "fixed",
      otherwise: yup
        .number()
        // .positive("Discount must be positive")
        .max(99.99, "Discount must be less than 100%")
    })
});

export default function () {
  const formik = useFormik({
    initialValues: {
      product_name: "",
      price: "",
      discount_type: "fixed",
      discount_amount: ""
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
      alert("ok");
    }
  });

  const { handleSubmit, errors, touched, getFieldProps, values } = formik;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold my-2">Add new product</h1>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <input
            className="p-2 border border-gray-400 rounded my-1"
            {...getFieldProps("product_name")}
            placeholder="Product Name"
          />
          <p className="text-red-500 text-sm">
            {touched.product_name && errors.product_name}
          </p>
          <input
            className="p-2 border border-gray-400 rounded my-1"
            {...getFieldProps("price")}
            placeholder="Price"
          />
          <p className="text-red-500 text-sm">
            {touched.price && errors.price}
          </p>

          <label>Discount Type</label>
          <br />
          <select
            className="border p-2 border-gray-400"
            {...getFieldProps("discount_type")}
          >
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
          <br />

          <input
            className="p-2 border border-gray-400 rounded my-1"
            {...getFieldProps("discount_amount")}
            placeholder="Discount"
          />
          <p className="text-red-500 text-sm">
            {touched.discount_amount && errors.discount_amount}
          </p>

          <button
            type="submit"
            className="p-2 px-4 bg-slate-900 text-white my-2 rounded"
          >
            submit
          </button>
        </Form>
      </FormikProvider>
    </div>
  );
}
