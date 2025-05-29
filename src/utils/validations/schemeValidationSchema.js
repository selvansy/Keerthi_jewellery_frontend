// import * as Yup from "yup";

// const amountSchema = Yup.number()
//   .typeError("Must be a valid number")
//   .test("is-decimal", "Invalid number format", (value) => {
//     if (value === undefined || value === null) return true;
//     return !value.toString().includes("e");
//   })
//   .min(0, "Must be 0 or a positive number");

// export const schemeValidationSchema = Yup.object({
//   scheme_name: Yup.string()
//     .required("Scheme name is required")
//     .max(30, "Scheme name cannot exceed 30 characters"),
//   code: Yup.string()
//     .required("Scheme code is required")
//     .max(15, "Scheme code cannot exceed 15 characters"),
//   installment_type: Yup.string().required("Installment type is required"),
//   scheme_type:Yup.string().required('Scheme type is required'),
//   id_classification: Yup.string().required("Classification is required"),
//   id_purity: Yup.string().required("Purity is required"),
//   id_metal: Yup.string().required("Metal is required"),
//   maturity_period: Yup.number()
//     .typeError("Maturity Period must be a number")
//     .required("Maturity Period is required")
//     .integer("Maturity Period must be a whole number")
//     .positive("Maturity Period must be a positive number")
//     .max(336, "Maturity Period cannot exceed 336")
//     .test(
//       "max-length",
//       "Maturity month cannot be more than 3 digits",
//       (value) => String(value).length <= 3
//     ),
//   saving_type: Yup.number()
//     .optional("Saving type is required")
//     .required("Scheme type is required"),
//     totalCountAmount: Yup.number().when("classType", {
//     is: true,
//     then: (schema) =>
//       schema
//         .required("Total count is required")
//         .min(0, "Minimum value allowed is 0")
//         .max(50, "Maximum value allowed is 50")
//         .test(
//           "maxDigits",
//           "Maximum 11 digits are allowed",
//           (value) => value && value.toString().length <= 11
//         ),
//   }),
//   incrementRate: Yup.number().when("classType", {
//     is: true,
//     then: (schema) =>
//       schema
//         .required("Increment rate is required")
//         .min(0, "Minimum value allowed is 0")
//         .test(
//           "maxDigits",
//           "Maximum 11 digits are allowed",
//           (value) => value && value.toString().length <= 11
//         ),
//   }),
//   startingAmount: Yup.number().when(["classType", "scheme_type"], {
//     is: (classType, scheme_type) => classType && [12, 3, 4].includes(scheme_type),
//     then: (schema) =>
//       schema
//         .required("Starting weight is required")
//         .min(0, "Minimum value allowed is 0")
//         .test(
//           "maxDigits",
//           "Maximum 11 digits are allowed",
//           (value) => value && value.toString().length <= 11
//         ),
//     otherwise: (schema) =>
//       schema.when("classType", {
//         is: true,
//         then: (schema) =>
//           schema
//             .required("Starting amount is required")
//             .min(0, "Minimum value allowed is 0")
//             .test(
//               "maxDigits",
//               "Maximum 11 digits are allowed",
//               (value) => value && value.toString().length <= 11
//             ),
//       }),
//   }),
//   description: Yup.string().required("Description is required"),
//   term_desc: Yup.string().required("Terms and conditions is required"),
//   classification_order: Yup.number(),
//   min_weight: Yup.number().when(["classType", "scheme_type"], {
//     is: (classType, scheme_type) =>
//       !classType && [12, 3, 4].includes(Number(scheme_type)),
//     then: (schema) =>
//       schema
//         .required("Minimum Weight is required")
//         .min(0, "Must be 0 or a positive number"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   max_weight: Yup.number().when(["classType", "scheme_type"], {
//     is: (classType, scheme_type) =>
//       (!classType && [12, 3, 4].includes(Number(scheme_type))),
//     then: (schema) =>
//       schema
//         .required("Maximum Weight is required")
//         .min(0, "Must be 0 or a positive number"),
//     otherwise: (schema) => schema.notRequired(),
//   })
//   .test("is-greater", "Maximum weight must be greater than Minimum weight", function (value) {
//     const { min_weight } = this.parent;
//     return value === undefined || min_weight === undefined || value > min_weight;
//   }),
//   min_amount: Yup.number().when(["classType", "scheme_type"], {
//     is: (classType, scheme_type) => !classType && !([12, 3, 4].includes(Number(scheme_type))),
//     then: (schema) => schema.required("Minimum Amount is required"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   max_amount: Yup.number()
//   .when(["classType", "scheme_type"], {
//     is: (classType, scheme_type) => 
//       !classType && ![12, 3, 4].includes(Number(scheme_type)),
//     then: (schema) => 
//       schema
//         .required("Maximum Amount is required")
//         .test("is-greater", "Maximum Amount must be greater than Minimum Amount", function (value) {
//           const { min_amount } = this.parent;
//           return value === undefined || min_amount === undefined || value > min_amount;
//         }),
//     otherwise: (schema) => 
//       schema.notRequired()
//   }),
//   total_installments: Yup.number().required(
//     "Total Installments is required"
//   ),
//   wastagebenefit: Yup.string().required("Wastage Benefit is required"),
//   benefit_making: Yup.string().required(
//     "Benefit making charge is required"
//   ),
//   limit_installment: Yup.number()
//     .typeError("Must be a number")
//     .min(0, "Must be 0 or a positive number"),
//   pending_installment: Yup.number()
//     .typeError("Must be a number")
//     .min(0, "Must be 0 or a positive number"),
//   paid_installment: Yup.number()
//     .typeError("Must be a number")
//     .min(0, "Must be 0 or a positive number"),
//   limit_customer: Yup.number()
//     .typeError("Must be a number")
//     .min(0, "Must be 0 or a positive number"),
//   no_of_gifts: Yup.number()
//     .typeError("Must be a number")
//     .nullable()
//     .min(0, "Must be 0 or a positive number"),
//   reward_type: Yup.number()
//     .typeError("Must be a number")
//     .nullable()
//     .min(0, "Must be 0 or a positive number"),
//   reward_amount: Yup.number()
//     .typeError("Must be a number")
//     .nullable()
//     .min(0, "Must be 0 or a positive number"),
//   reward_percent: Yup.number()
//     .typeError("Must be a number")
//     .nullable()
//     .min(0, "Must be 0 or a positive number"),
//   not_paid_installment: Yup.number()
//     .typeError("Must be a number")
//     .min(0, "Must be 0 or a positive number"),
//   convenience_fees: Yup.number()
//     .optional("Must be a number")
//     .min(0, "Must be 0 or a positive number")
//     .max(100,"Maximum 100 percentage"),
//     bonus_type: Yup.number()
//     .nullable() 
//     .transform((value, originalValue) => 
//       originalValue === "" ? null : value
//     )
//     .typeError("Must be a number")
//     .optional(),
  
// });
import * as Yup from "yup";

const amountSchema = Yup.number()
  .typeError("Must be a valid number")
  .test("is-decimal", "Invalid number format", (value) => {
    if (value === undefined || value === null) return true;
    return !value.toString().includes("e");
  })
  .min(0, "Must be 0 or a positive number");

export const schemeValidationSchema = Yup.object({
  scheme_name: Yup.string()
    .required("Scheme name is required")
    .max(30, "Scheme name cannot exceed 30 characters"),
  code: Yup.string()
    .required("Scheme code is required")
    .max(15, "Scheme code cannot exceed 15 characters"),
  installment_type: Yup.string().required("Installment type is required"),
  scheme_type: Yup.string().required('Scheme type is required'),
  id_classification: Yup.string().required("Classification is required"),
  id_purity: Yup.string().required("Purity is required"),
  id_metal: Yup.string().required("Metal is required"),
  maturity_period: Yup.number()
    .typeError("Maturity Period must be a number")
    .required("Maturity Period is required")
    .integer("Maturity Period must be a whole number")
    .positive("Maturity Period must be a positive number")
    .max(365, "Maturity Period cannot exceed 336")
    .test(
      "max-length",
      "Maturity month cannot be more than 3 digits",
      (value) => String(value).length <= 3
    ),
  saving_type: Yup.number()
    .optional("Saving type is required")
    .required("Scheme type is required"),
  totalCountAmount: Yup.number().when("classType", {
    is: true,
    then: (schema) =>
      schema
        .required("Total count is required")
        .min(0, "Minimum value allowed is 0")
        .max(50, "Maximum value allowed is 50")
        .test(
          "maxDigits",
          "Maximum 11 digits are allowed",
          (value) => value && value.toString().length <= 11
        ),
  }),
  incrementRate: Yup.number().when("classType", {
    is: true,
    then: (schema) =>
      schema
        .required("Increment rate is required")
        .min(0, "Minimum value allowed is 0")
        .test(
          "maxDigits",
          "Maximum 11 digits are allowed",
          (value) => value && value.toString().length <= 11
        ),
  }),
  startingAmount: Yup.number().when(["classType", "scheme_type"], {
    is: (classType, scheme_type) => classType && [12, 3, 4].includes(Number(scheme_type)),
    then: (schema) =>
      schema
        .required("Starting weight is required")
        .min(0, "Minimum value allowed is 0")
        .test(
          "maxDigits",
          "Maximum 11 digits are allowed",
          (value) => value && value.toString().length <= 11
        ),
    otherwise: (schema) =>
      schema.when("classType", {
        is: true,
        then: (schema) =>
          schema
            .required("Starting amount is required")
            .min(0, "Minimum value allowed is 0")
            .test(
              "maxDigits",
              "Maximum 11 digits are allowed",
              (value) => value && value.toString().length <= 11
            ),
      }),
  }),
  description: Yup.string()
    .required("Description is required")
    .max(850, "Description cannot exceed 850 characters"),
  
  term_desc: Yup.string()
    .required("Terms and conditions is required")
    .max(850, "Terms and conditions cannot exceed 850 characters"),
  classification_order: Yup.number(),
  min_weight: Yup.number().when(["scheme_type", "classType"], {
    is: (scheme_type, classType) => 
      !classType && [12, 3, 4].includes(Number(scheme_type)),
    then: (schema) =>
      schema
        .required("Minimum Weight is required")
        .min(0, "Must be 0 or a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  max_weight: Yup.number()
    .when(["scheme_type", "classType", "min_weight"], {
      is: (scheme_type, classType, min_weight) => 
        !classType && [12, 3, 4].includes(Number(scheme_type)) && min_weight !== undefined,
      then: (schema) =>
        schema
          .required("Maximum Weight is required")
          .min(Yup.ref('min_weight'), "Maximum weight must be greater than Minimum weight")
          .min(0, "Must be 0 or a positive number"),
      otherwise: (schema) => schema.notRequired(),
    }),
  min_amount: Yup.number().when(["scheme_type", "classType"], {
    is: (scheme_type, classType) => 
      !classType && ![12, 3, 4].includes(Number(scheme_type)),
    then: (schema) => 
      schema
        .required("Minimum Amount is required")
        .min(0, "Must be 0 or a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  max_amount: Yup.number()
    .when(["scheme_type", "classType", "min_amount"], {
      is: (scheme_type, classType, min_amount) => 
        !classType && ![12, 3, 4].includes(Number(scheme_type)) && min_amount !== undefined,
      then: (schema) =>
        schema
          .required("Maximum Amount is required")
          .min(Yup.ref('min_amount'), "Maximum Amount must be greater than Minimum Amount")
          .min(0, "Must be 0 or a positive number"),
      otherwise: (schema) => schema.notRequired(),
    }),
  total_installments: Yup.number().required(
    "Total Installments is required"
  ),
  wastagebenefit: Yup.string().required("Wastage Benefit is required"),
  benefit_making: Yup.string().required(
    "Benefit making charge is required"
  ),
  limit_installment: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or a positive number"),
  pending_installment: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or a positive number"),
  paid_installment: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or a positive number"),
  limit_customer: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or a positive number"),
  no_of_gifts: Yup.number()
    .typeError("Must be a number")
    .nullable()
    .min(0, "Must be 0 or a positive number"),
  reward_type: Yup.number()
    .typeError("Must be a number")
    .nullable()
    .min(0, "Must be 0 or a positive number"),
  reward_amount: Yup.number()
    .typeError("Must be a number")
    .nullable()
    .min(0, "Must be 0 or a positive number"),
  reward_percent: Yup.number()
    .typeError("Must be a number")
    .nullable()
    .min(0, "Must be 0 or a positive number"),
  not_paid_installment: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or a positive number"),
  convenience_fees: Yup.number()
    .optional("Must be a number")
    .min(0, "Must be 0 or a positive number")
    .max(100,"Maximum 100 percentage"),
  bonus_type: Yup.number()
    .nullable() 
    .transform((value, originalValue) => 
      originalValue === "" ? null : value
    )
    .typeError("Must be a number")
    .optional(),
});