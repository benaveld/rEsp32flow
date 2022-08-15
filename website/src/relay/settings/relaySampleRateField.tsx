import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { onSubmitType } from "../../AppTypes";
import { useGetRelayStatusQuery, useSetSampleRateMutation } from "../relayApi";

export type RelaySampleRateFieldProps = {
  addSubmitHandler: Dispatch<SetStateAction<onSubmitType[]>>;
} & TextFieldProps;

export const RelaySampleRateField = forwardRef<
  HTMLDivElement,
  RelaySampleRateFieldProps
>(({ addSubmitHandler, ...props }, ref) => {
  const [postSampleRate] = useSetSampleRateMutation();
  const { updateRate } = useGetRelayStatusQuery(undefined, {
    selectFromResult: ({ data }) => ({ updateRate: data?.updateRate }),
  });

  const [sampleRate, setSampleRate] = useState((updateRate ?? 1000) / 1000);
  const maxSampleRate = 2 ** 32 / 1000;

  const handleChange: TextFieldProps["onChange"] = (ev) =>
    setSampleRate(Number(ev.target.value));

  const sampleRateHelperText = useCallback(() => {
    if (sampleRate <= 0) return "Must be more then 0 sec.";
    if (sampleRate >= maxSampleRate)
      return `Can't be more then ${maxSampleRate}.`;
    return undefined;
  }, [maxSampleRate, sampleRate]);

  const isValid = useCallback(
    () => sampleRateHelperText() === undefined,
    [sampleRateHelperText]
  );

  useEffect(() => {
    const handleSubmit: onSubmitType = async () => {
      const updatedSampleRate = Math.round(sampleRate * 1000);
      console.log(
        `try update ${isValid()}, ${updatedSampleRate} !== ${updateRate}`
      );
      console.log(sampleRateHelperText());
      if (isValid() && updatedSampleRate !== updateRate) {
        try {
          await postSampleRate(updatedSampleRate).unwrap();
        } catch (e) {
          console.log("error: ", e);
        }
      }
    };

    addSubmitHandler((value) => [...value, handleSubmit]);
    return () => {
      addSubmitHandler((value) =>
        value.filter((value) => value !== handleSubmit)
      );
    };
  }, [
    addSubmitHandler,
    isValid,
    postSampleRate,
    sampleRate,
    sampleRateHelperText,
    updateRate,
  ]);

  return (
    <TextField
      ref={ref}
      variant="standard"
      type="number"
      label="Relay Sample Rate"
      value={sampleRate}
      InputProps={{
        endAdornment: <InputAdornment position="end">sec</InputAdornment>,
      }}
      onChange={handleChange}
      error={!isValid()}
      helperText={sampleRateHelperText()}
      {...props}
    />
  );
});

RelaySampleRateField.displayName = "RelaySampleRateField";
