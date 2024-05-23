import FormInput from "@/components/form-input";
import FormBtn from "@/components/form-btn";

const SMSLogin = () => {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          required
          type="number"
          placeholder="Phone number"
          errors={[]}
        />
        <FormInput
          required
          type="number"
          placeholder="Verification Code"
          errors={[]}
        />
        <FormBtn loading={false} text="Send the message" />
      </form>
    </div>
  );
};

export default SMSLogin;
