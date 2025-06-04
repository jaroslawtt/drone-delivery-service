"use client";
import { useQuery } from "@tanstack/react-query";
import { JSX, useEffect, useState } from "react";
import {
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cnMerge } from "~/libs/helpers/cn-merge";
import { useFormController } from "~/libs/hooks/hooks";
import { geocoding } from "@maptiler/sdk";
import { ScrollArea } from "~/libs/ui/scroll-area";
import { debounce } from "~/libs/helpers/debounce";
import { MapLocation } from "~/packages/map/libs/types/types";
import { Eye, EyeOff } from "lucide-react";

type Properties<T extends FieldValues> = {
  control: Control<T, null>;
  errors: FieldErrors<T>;
  name: FieldPath<T>;
  label?: string;
  className?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "location";
  isDisabled?: boolean;
};

const Input = <T extends FieldValues>({
  name,
  control,
  type,
  label,
  className,
  placeholder,
  errors,
  isDisabled = false,
}: Properties<T>): JSX.Element => {
  const { field } = useFormController({
    name,
    control,
    disabled: isDisabled,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [fetchQuery, setFetchQuery] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");

  const error = errors[name]?.message;
  const hasError = Boolean(error);

  const { data: addressSuggestions } = useQuery({
    queryKey: ["addressSearch", fetchQuery],
    queryFn: async () => {
      const response = await geocoding.forward(fetchQuery, {
        limit: 5,
        country: ["ua"],
        bbox: [30.2, 50.2, 30.8, 50.7],
      });

      return response.features.map((feature) => ({
        name: feature.place_name,
        coordinates: feature.geometry,
      }));
    },
    enabled: type === "location",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
  const { data: addressCoordinates, isFetched } = useQuery({
    queryKey: ["adressCoordinates", field.value],
    queryFn: async () => {
      const location = field.value as MapLocation;

      if (
        !location ||
        typeof location.latitude !== "string" ||
        typeof location.longitude !== "string" ||
        !location.latitude.trim() ||
        !location.longitude.trim() ||
        isNaN(parseFloat(location.latitude)) ||
        isNaN(parseFloat(location.longitude))
      ) {
        return [];
      }

      const response = await geocoding.reverse([
        parseFloat(location.longitude),
        parseFloat(location.latitude),
      ]);

      return response.features.map((feature) => ({
        name: feature.place_name,
        coordinates: feature.geometry,
      }));
    },
    enabled: type === "location",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (type === "location") {
      const locValue = field.value as MapLocation;

      if (
        locValue &&
        typeof locValue === "object" &&
        locValue.latitude &&
        locValue.longitude &&
        isFetched
      ) {
        if (addressCoordinates?.at(0)) {
          return void setLocationName(addressCoordinates.at(0)?.name ?? "");
        } else {
          return void setLocationName("");
        }
      } else {
        return void setLocationName("");
      }
    }
  }, [addressCoordinates, isFetched, field.value, type]);

  if (type === "location") {
    return (
      <div className="relative w-full">
        <label
          htmlFor={name}
          className="absolute left-[12px] top-[2px] text-[12px] leading-[24px] text-tertiary z-10"
        >
          {label}
        </label>
        <input
          {...field}
          value={locationName}
          id={name}
          type="text"
          className={cnMerge(
            "text-[14px] w-full leading-[24px] font-semibold text-secondary pt-[24px] pb-[2px] px-[12px] border-solid border-[1px] border-[#E9E9E9] rounded-[7px]",
            className,
            {
              "border-red-500": hasError,
              "rounded-b-none": true,
            },
          )}
          placeholder={placeholder}
          disabled={isDisabled}
          autoComplete="off"
          onChange={(event) => {
            setLocationName(event.target.value);

            return void debounce(() => {
              setFetchQuery(event.target.value);
              if (event.target.value.trim()) {
                setIsVisible(true);
              } else {
                setIsVisible(false);
              }
            }, 500)();
          }}
          onFocus={() => {
            if (
              locationName.trim() ||
              (addressSuggestions && addressSuggestions.length > 0)
            ) {
              setIsVisible(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setIsVisible(false), 150);
          }}
        />
        {Boolean(addressSuggestions?.length) && isVisible && (
          <ScrollArea
            style={{
              position: "absolute",
            }}
            className="h-28 w-full z-40 bg-white border-solid border-[1px] border-[#E9E9E9] rounded-[7px]"
          >
            <ul className="h-full w-full">
              {addressSuggestions?.map((address) => (
                <li
                  onClick={(event) => {
                    event.stopPropagation();

                    field.onChange({
                      latitude: String(
                        (
                          address.coordinates as unknown as {
                            coordinates: [number, number];
                          }
                        ).coordinates.at(1) ?? "",
                      ),

                      longitude: String(
                        (
                          address.coordinates as unknown as {
                            coordinates: [number, number];
                          }
                        ).coordinates.at(0) ?? "",
                      ),
                    });

                    setIsVisible(false);
                  }}
                  className="p-4 cursor-pointer hover:bg-neutral-500"
                  key={address.name}
                >
                  {address.name}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
    );
  }

  const validClassNames = cnMerge(
    "text-[14px] w-full leading-[24px] font-semibold pt-[24px] pb-[2px] px-[12px] border-solid border-[1px] border-[#E9E9E9] rounded-[7px]",
    className,
    {
      "border-red-500": hasError,
      "pr-[36px]": type === "password",
    },
  );

  return (
    <label className="relative overflow-hidden">
      <span className="absolute left-[12px] text-[12px] leading-[24px] text-tertiary text-nowrap">
        {label}
      </span>
      <input
        {...field}
        type={
          type === "password" ? (isPasswordVisible ? "text" : "password") : type
        }
        className={validClassNames}
        placeholder={placeholder}
        disabled={isDisabled}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      <span
        className={cnMerge(
          "ml-2 text-[12px] text-red-500 text-nowrap overflow-ellipsis",
          {
            invisible: !hasError,
          },
        )}
      >
        &#8203;
        {error && error.toString()}
      </span>
    </label>
  );
};

export { Input };
