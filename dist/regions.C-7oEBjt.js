import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useFormContext, FormProvider, Controller } from "react-hook-form";
import { e as cn } from "./card.CpcqKk8f.js";
import { L as Label } from "./label.D82FCtcQ.js";
const Form = FormProvider;
const FormFieldContext = React.createContext(null);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(null);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const KABUPATEN_DATA = [
  {
    id: "cianjur",
    name: "Kabupaten Cianjur",
    kecamatan: [
      "Agrabinta",
      "Bojongpicung",
      "Campaka",
      "Campakamulya",
      "Cianjur",
      "Cibeber",
      "Cibinong",
      "Cidaun",
      "Cijati",
      "Cikadu",
      "Cikalongkulon",
      "Cilaku",
      "Cipanas",
      "Ciranjang",
      "Cugenang",
      "Gekbrong",
      "Haurwangi",
      "Kadupandak",
      "Karangtengah",
      "Leles",
      "Mande",
      "Naringgul",
      "Pacet",
      "Pagelaran",
      "Pasirkuda",
      "Sindangbarang",
      "Sukaluyu",
      "Sukanagara",
      "Sukaresmi",
      "Takokak",
      "Tanggeung",
      "Warungkondang"
    ]
  },
  {
    id: "sukabumi",
    name: "Kabupaten Sukabumi",
    kecamatan: [
      "Cicurug",
      "Cidahu",
      "Cidolog",
      "Ciemas",
      "Cikakak",
      "Cikembar",
      "Cikidang",
      "Ciracap",
      "Cisolok",
      "Cisaat",
      "Gegerbitung",
      "Jampang Kulon",
      "Jampang Tengah",
      "Kabandungan",
      "Kalapanunggal",
      "Lengkong",
      "Nyalindung",
      "Pabuaran",
      "Palabuhanratu",
      "Parung Kuda",
      "Purabaya",
      "Sagaranten",
      "Simpenan",
      "Sukabumi",
      "Sukaraja",
      "Warungkiara"
    ]
  },
  {
    id: "bandung",
    name: "Kabupaten Bandung",
    kecamatan: [
      "Arjasari",
      "Baleendah",
      "Banjaran",
      "Bojongsoang",
      "Cangkuang",
      "Cicalengka",
      "Cikancung",
      "Cilengkrang",
      "Cileunyi",
      "Cimaung",
      "Cimenyan",
      "Ciparay",
      "Ciwidey",
      "Dayeuhkolot",
      "Ibun",
      "Katapang",
      "Kertasari",
      "Kutawaringin",
      "Majalaya",
      "Margaasih",
      "Margahayu",
      "Nagreg",
      "Pacet",
      "Pameungpeuk",
      "Pangalengan",
      "Paseh",
      "Pasirjambu",
      "Rancabali",
      "Rancaekek",
      "Solokanjeruk",
      "Soreang"
    ]
  }
];
function getKecamatanByKabupaten(kabupatenId) {
  const kabupaten = KABUPATEN_DATA.find((k) => k.id === kabupatenId);
  return kabupaten?.kecamatan || [];
}
export {
  Form as F,
  KABUPATEN_DATA as K,
  FormField as a,
  FormItem as b,
  FormLabel as c,
  FormControl as d,
  FormDescription as e,
  FormMessage as f,
  getKecamatanByKabupaten as g
};
