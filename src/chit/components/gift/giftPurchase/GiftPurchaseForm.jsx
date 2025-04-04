import React from 'react'

function GiftPurchaseForm() {
    return (
        <>
            <div className="w-full flex flex-col bg-white">
                <div className="flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2">
                <h3 className="text-2xl text-gray-900 font-bold my-3 mx-10">Legal Policies</h3>
                    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300">

                    <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">
                                Branch<span className="text-red-400">*</span>
                            </label>

                            <Select
                                options={branchData}
                                value={
                                    branchData.find(
                                        (option) =>
                                            option.value === (id_branch !== "0" ? addCusData.id_branch : formik.values.id_branch)
                                    ) || ""
                                }
                                onChange={(option) => formik.setFieldValue("id_branch", option?.value || "")}
                                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                                styles={customSelectStyles}
                                isLoading={loadingbranch}
                                isDisabled={id_branch !== "0"}
                                placeholder="Select Branch"
                            />


                            {formik.errors.id_branch && (
                                <div style={{ color: "red" }}>
                                    {formik.errors.id_branch}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                First Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                value={formik.values.firstname}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    formik.setFieldTouched("firstname", false);
                                }}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Here"
                            />
                            {formik.errors.firstname ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.firstname}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Last Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formik.values.lastname}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    formik.setFieldTouched("lastname", false);
                                }}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Here"
                            />
                            {formik.errors.lastname ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.lastname}
                                </div>
                            ) : null}
                        </div>

                     

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Mobile<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "");
                                    formik.handleChange(e);
                                }}
                                value={formik.values.mobile}
                                pattern="\d{10}"
                                maxLength={"10"}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Mobile Number"
                            />

                            {formik.errors.mobile ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.mobile}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Whatsapp Number
                            </label>
                            <input
                                type="text"
                                name="whatsapp"
                                onInput={(e) =>
                                    (e.target.value = e.target.value.replace(/\D/g, ""))
                                }
                                value={formik.values.whatsapp}
                                onChange={(e) => {
                                    e.preventDefault();
                                    formik.handleChange(e);
                                    formik.setFieldTouched("whatsapp", false);
                                }}
                                pattern="\d{10}"
                                maxLength={"10"}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Whatsapp Number"
                            />
                            {formik.errors.whatsapp ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.whatsapp}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">
                                Gender<span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-row gap-6 justify-start">
                                {[
                                    { label: "Male", value: 1 },
                                    { label: "Female", value: 2 },
                                    { label: "Other", value: 3 },
                                ].map((gender) => (
                                    <button
                                        key={gender.value}
                                        type="button"
                                        className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${formik.values.gender === gender.value
                                            ? "text-white"
                                            : "bg-white text-black"
                                            }`}
                                        style={
                                            formik.values.gender === gender.value
                                                ? { backgroundColor: layout_color }
                                                : {}
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            formik.setFieldValue("gender", gender.value);
                                            formik.setFieldTouched("gender", false);
                                        }}
                                    >
                                        {gender.label}
                                    </button>
                                ))}
                            </div>
                            {formik.errors.gender ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.gender}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">
                                Country<span className="text-red-400">*</span>
                            </label>

                            <Select
                                options={countryData}
                                value={
                                    countryData.find(
                                        (ctry) => ctry.value === formik.values.id_country
                                    ) || country
                                }
                                onChange={(ctry) => {
                                    formik.setFieldValue("id_country", ctry.value);
                                    setCountry(ctry.value);
                                    formik.setFieldTouched("id_country", false);
                                }}
                                customSelectStyles={customSelectStyles}
                                isLoading={loadingCountries}
                                placeholder="Select Country"
                            />
                            {formik.errors.id_country ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.id_country}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">
                                State<span className="text-red-400">*</span>
                            </label>

                            <Select
                                options={stateData}
                                onChange={(e) => {
                                    formik.setFieldValue("id_state", e.value);
                                    setState(e.value);
                                    formik.setFieldTouched("id_state", false);
                                }}
                                customSelectStyles={customSelectStyles}
                                isLoading={loadingStates}
                                value={
                                    stateData.find(
                                        (ctry) => ctry.value === formik.values.id_state
                                    ) || state
                                }
                                placeholder="Select state"
                            />

                            {formik.errors.id_state ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.id_state}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">
                                City<span className="text-red-400">*</span>
                            </label>

                            <Select
                                options={cityData}
                                onChange={(e) => {
                                    formik.setFieldValue("id_city", e.value);
                                    setCity(e.value);
                                    formik.setFieldTouched("id_city", false);
                                }}
                                customSelectStyles={customSelectStyles}
                                isLoading={loadingCities}
                                value={
                                    cityData.find(
                                        (ctry) => ctry.value === formik.values.id_city
                                    ) || city
                                }
                                placeholder="Select city"
                            />

                            {formik.errors.id_city ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.id_city}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Address<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={(e) => {
                                    e.preventDefault();
                                    formik.handleChange(e);
                                    formik.setFieldTouched("address", false);
                                }}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Here"
                            />
                            {formik.errors.address ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.address}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Pincode<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formik.values.pincode}
                                onInput={(e) =>
                                    (e.target.value = e.target.value.replace(/\D/g, ""))
                                }
                                onChange={(e) => {
                                    e.preventDefault();
                                    formik.handleChange(e);
                                    formik.setFieldTouched("pincode", false);
                                }}
                                pattern="\d{6}"
                                maxLength={"6"}
                                className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Enter Pincode"
                            />
                            {formik.errors.pincode ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.pincode}
                                </div>
                            ) : null}
                        </div>



                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Aadhar Card Number
                                <span className="text-red-400"> *</span>
                            </label>
                            <input
                                type="text"
                                name="authorno"
                                value={formik.values.authorno}
                                pattern="\d{12}"
                                onInput={(e) =>
                                    (e.target.value = e.target.value.replace(/\D/g, ""))
                                }
                                maxLength="12"
                                inputMode="numeric"
                                onChange={formik.handleChange}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Aadhar Number"
                            />

                            {formik.errors.authorno ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.authorno}
                                </div>
                            ) : null}
                        </div>






                    </div>
                </div>
            </div>
        </>
    )
}

export default GiftPurchaseForm