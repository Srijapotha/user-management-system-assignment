import React, { useState } from "react";
import Joi from "joi";

export default function Modal(props) {
   const { id, heading, description, apiFunction, onSuccess, defaultValue } =
      props;
   const [message, setMessage] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Get form values
      const form = e.target;
      const formValues = {
         firstName: form.firstName.value.trim(),
         lastName: form.lastName.value.trim(),
         email: form.email.value.trim(),
         department: form.department.value.trim(),
      };

      // Validate form data
      const schema = Joi.object({
         firstName: Joi.string().min(2).required().label("First Name"),
         lastName: Joi.string().min(2).required().label("Last Name"),
         email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .label("Email"),
         department: Joi.string().min(2).required().label("Department"),
      });

      const { error, value } = schema.validate(formValues, {
         abortEarly: false,
      });

      if (error) {
         // showing error response
         const errorMessages = error.details
            .map((detail) => detail.message)
            .join(", ");
         setMessage({ type: "error", text: errorMessages });
         return;
      }

      setMessage(null); // Clear any previous messages
      setIsSubmitting(true); // Disable button

      // Call addData function
      const response = await apiFunction(value);

      setIsSubmitting(false); // Re-enable button

      if (response) {
         onSuccess(response);
         form.reset(); // Reset form fields
         document.getElementById(id).click(); // Close the modal
      } else {
         setMessage({
            type: "error",
            text: "Something went wrong. Please try again later.",
         });
      }
   };
   return (
      <>
         <input type="checkbox" id={id} className="modal-toggle" />
         <div className="modal" role="dialog">
            <form onSubmit={handleSubmit} className="modal-box">
               <h3 className="text-lg font-bold">{heading}</h3>
               <p className="py-4">{description}</p>
               <div className="flex flex-col gap-3">
                  <label className="form-control w-full">
                     <div className="label">
                        <span className="label-text">First Name</span>
                     </div>
                     <input
                        type="text"
                        placeholder="e.g. John"
                        className="input input-bordered"
                        name="firstName"
                        defaultValue={defaultValue?.name?.split(" ")[0]}
                     />
                  </label>
                  <label className="form-control w-full">
                     <div className="label">
                        <span className="label-text">Last Name</span>
                     </div>
                     <input
                        type="text"
                        placeholder="e.g. Doe"
                        className="input input-bordered"
                        name="lastName"
                        defaultValue={defaultValue?.name?.split(" ")[1]}
                     />
                  </label>
                  <label className="form-control w-full">
                     <div className="label">
                        <span className="label-text">Email</span>
                     </div>
                     <input
                        type="text"
                        placeholder="e.g. 4tM8S@example.com"
                        className="input input-bordered"
                        name="email"
                        defaultValue={defaultValue?.email}
                     />
                  </label>
                  <label className="form-control w-full">
                     <div className="label">
                        <span className="label-text">Department</span>
                     </div>
                     <input
                        type="text"
                        placeholder="e.g. Marketing"
                        className="input input-bordered"
                        name="department"
                        defaultValue={defaultValue?.company?.catchPhrase}
                     />
                  </label>
               </div>
               <div className="mt-3">
                  {message && (
                     <div
                        className={`alert ${
                           message.type === "error"
                              ? "alert-error"
                              : message.type === "success"
                              ? "alert-success"
                              : "alert-info"
                        }`}
                     >
                        {message.text}
                     </div>
                  )}
               </div>
               <div className="modal-action">
                  <label htmlFor={id} className="btn">
                     Close!
                  </label>
                  <button
                     type="submit"
                     className="btn btn-success"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? "Saving..." : "Save User"}
                  </button>
               </div>
            </form>
            <label className="modal-backdrop" htmlFor={id}>
               Close
            </label>
         </div>
      </>
   );
}
