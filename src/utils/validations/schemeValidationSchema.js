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
  scheme_type:Yup.string().required('Scheme type is required'),
  id_classification: Yup.string().required("Classification is required"),
  id_purity: Yup.string().required("Purity is required"),
  id_metal: Yup.string().required("Metal is required"),
  maturity_period: Yup.number()
    .typeError("Maturity Period must be a number")
    .required("Maturity Period is required")
    .integer("Maturity Period must be a whole number")
    .positive("Maturity Period must be a positive number")
    .max(336, "Maturity Period cannot exceed 336")
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
    is: (classType, scheme_type) => classType && [12, 3, 4].includes(scheme_type),
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
  description: Yup.string().required("Description is required"),
  term_desc: Yup.string().required("Terms and conditions is required"),
  classification_order: Yup.number(),
// grace_type: Yup.string()
//   // .typeError("Grace type must be a number")
//   .optional(),
// grace_period: Yup.number()
//   .typeError("Grace period must be a number")
//   .min(0, "Must be 0 or a positive number")
//   .nullable()
//   .transform((value, originalValue) => (originalValue === "" ? null : value)) // Handle empty input
//   .when("grace_type", {
//     is: (val) => Number(val) > 0,
//     then: Yup.number()
//       .required("Grace period is required")
//       .test(
//         "grace_period_validation",
//         "Grace period cannot be greater than maturity period",
//         function (grace_period) {
//           console.log("Grace Period Type:", typeof grace_period, grace_period); // Debugging

//           const { maturity_period } = this.parent;

//           if (typeof grace_period !== "number" || typeof maturity_period !== "number") {
//             return true;
//           }

//           return grace_period <= maturity_period;
//         }
//       ),
//   }),
  // grace_fine: Yup.number()
  //   .typeError("Grace fine must be a number")
  //   .min(0, "Must be 0 or a positive number")
  //   .max(100,"Fine amount must below 100")
  //   .when("fine_amount", {
  //     is: true,
  //     then: Yup.number().required("Grace fine is required"),
  //   }),
  // min_amount: Yup.number().when(["classType", "scheme_type"], {
  //   is: (classType, scheme_type) =>
  //     !classType && ![12, 3, 4].includes(scheme_type),
  //   then: (schema) =>
  //     schema
  //       .required("Minimum Amount is required")
  //       .min(0, "Must be 0 or a positive number"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // max_amount: Yup.number().when(["classType", "scheme_type"], {
  //   is: (classType, scheme_type) =>
  //     !classType && ![12, 3, 4].includes(scheme_type),
  //   then: (schema) =>
  //     schema
  //       .required("Maximum Amount is required")
  //       .min(0, "Must be 0 or a positive number"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  min_weight: Yup.number().when(["classType", "scheme_type"], {
    is: (classType, scheme_type) =>
      !classType && [12, 3, 4,2,5,6].includes(Number(scheme_type)),
    then: (schema) =>
      schema
        .required("Minimum Weight is required")
        .min(0, "Must be 0 or a positive number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  max_weight: Yup.number().when(["classType", "scheme_type"], {
    is: (classType, scheme_type) =>
      (classType && [12, 3, 4].includes(Number(scheme_type))) ||
      (!classType && [12, 3, 4].includes(Number(scheme_type))),
    then: (schema) =>
      schema
        .required("Maximum Weight is required")
        .min(0, "Must be 0 or a positive number"),
    otherwise: (schema) => schema.notRequired(),
  })
  .test("is-greater", "Maximum weight must be greater than Minimum weight", function (value) {
    const { min_weight } = this.parent;
    return value === undefined || min_weight === undefined || value > min_weight;
  }),
  min_amount: Yup.number().when(["classType", "scheme_type"], {
    is: (classType, scheme_type) => !classType && !([12, 3, 4].includes(Number(scheme_type))),
    then: (schema) => schema.required("Minimum Amount is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  max_amount: Yup.number()
    .when(["classType", "scheme_type"], {
      is: (classType, scheme_type) => 
        !classType && ![12, 3, 4].includes(Number(scheme_type)),
      then: (schema) => schema.required("Maximum Amount is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test("is-greater", "Maximum Amount must be greater than Minimum Amount", function (value) {
      const { min_amount } = this.parent;
      return value === undefined || min_amount === undefined || value > min_amount;
    }),
  total_installments: Yup.number().required(
    "Total Installments is required"
  ),
  // buy_gst: Yup.number().optional("Buy GST is required")
  // .min(0,"Gst percentage should be below minimum 0")
  // .max(100,"Maximum gst percentage should be 100"),
  // buytgsttype: Yup.string().optional("Buy GST Type is required"),
  wastagebenefit: Yup.string().required("Wastage Benefit is required"),
  benefit_making: Yup.string().required(
    "Benefit making charge is required"
  ),
  // customer_referral_per: Yup.number()
  //  .max(100,"Maximum allowed percentage is 100")
  //   .typeError("Must be a number")
  //   .positive("Must be a positive number"),
  // customer_incentive_per: Yup.number()
  // .max(100,"Maximum allowed percentage is 100")
  //   .typeError("Must be a number")
  //   .positive("Must be a positive number"),
  // customer_ref_remarks: Yup.string().typeError("Must be a alphabet"),
  // agent_referral_percentage: Yup.number()
  // .max(100,"Max agent referra percentage is 100")
  //   .typeError("Must be a number")
  //   .positive("Must be a positive number"),
  // agent_incentive: Yup.number()
  // .max(100,"Max allowed percentage is 100")
  //   .typeError("Must be a number")
  //   .positive("Must be a positive number"),
  // agent_remark: Yup.string().typeError("Must be a alphabet"),
  // agent_restriction: Yup.boolean()
  // .nullable()
  // .transform((value, originalValue) => (originalValue === "" ? null : value)) // Converts empty string to null
  // .optional(),
  // agent_target_per: Yup.number()
  // .typeError("Must be a number")
  // .when('agent_restriction', {
  //   is: true,
  //   then: () => Yup.number()
  //     .max(100,'Maximum allowed percentage is 100')
  //     .typeError("Must be a number")
  //     .positive("Must be a positive number")
  //     .required("Agent target is required"),
  //   otherwise: () => Yup.number().notRequired(),
  // }),
  // agent_partial_per: Yup.number()
  // .typeError("Must be a number")
  // .positive("Must be a positive number")
  // .when(['agent_restriction', 'agent_target_per'], {
  //   is: (agent_restriction, agent_target_per) => agent_restriction && agent_target_per && Number(agent_target_per) > 0,
  //   then: () => Yup.number()
  //   .max(100,"Max allowed percentage is 100")
  //   .required(
  //     "Partial commission is required when agent target is set"
  //   ),
  //   otherwise: () => Yup.number().notRequired(),
  // }),
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
  // fine_amount: Yup.number()
  //   .typeError("Must be a number")
  //   .min(0, "Must be 0 or a positive number"),
  // cumulative_fine_amount: Yup.number()
  //   .typeError("Must be a number")
  //   .min(0, "Must be 0 or a positive number"),
    bonus_type: Yup.number()
    .nullable() 
    .transform((value, originalValue) => 
      originalValue === "" ? null : value
    )
    .typeError("Must be a number")
    .optional(),
  
});