"use client";

import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import * as z from "zod/mini";
import en from "zod/v4/locales/en.js";

// Zod Mini ships no messages; load the English ones classic Zod uses so built-in issues read the same.
z.config(en());

const emptyEmailMessage = "Oops! Please add your email";
const invalidEmailMessage = "Oops! Please check your email";

const emailSchema = z.pipe(
  z.string().check(z.trim(), z.minLength(1, { error: emptyEmailMessage, abort: true })),
  z.email({ error: invalidEmailMessage }),
);

/** The demo pauses briefly so the busy state is visible; nothing leaves the browser. */
const demoDelayMs = 700;

function messageOf(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "";
}

export function RequestAccessForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState("");
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value, formApi }) => {
      await new Promise(resolve => setTimeout(resolve, demoDelayMs));
      setConfirmed(`Thanks! ${value.email.trim()} is on the demo list. Nothing was sent.`);
      formApi.reset();
    },
    onSubmitInvalid: () => {
      setConfirmed("");
      inputRef.current?.focus();
    },
  });

  return (
    <form
      className="request"
      noValidate
      aria-label="Request early access"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        if (form.state.isSubmitting) return;
        void form.handleSubmit();
      }}
    >
      <form.Subscribe selector={state => [state.isSubmitting, state.submissionAttempts] as const}>
        {([isSubmitting, attempts]) => (
          <form.Field name="email" validators={{ onChange: emailSchema, onSubmit: emailSchema }}>
            {field => {
              const error = attempts > 0 ? messageOf(field.state.meta.errors[0]) : "";
              return (
                <>
                  <div className="request-row" data-invalid={error ? "true" : undefined}>
                    <label className="sr-only" htmlFor="email">Email address</label>
                    <input
                      ref={inputRef}
                      id="email"
                      name={field.name}
                      className="request-input"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Email address"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={event => {
                        setConfirmed("");
                        field.handleChange(event.target.value);
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "email-error demo-note" : "demo-note"}
                    />
                    <button className="request-button" type="submit" aria-busy={isSubmitting || undefined}>
                      {isSubmitting && <span className="spinner" aria-hidden="true" />}
                      {isSubmitting ? "Requesting…" : "Request Access"}
                    </button>
                  </div>
                  {error && <p id="email-error" className="request-error">{error}</p>}
                </>
              );
            }}
          </form.Field>
        )}
      </form.Subscribe>
      <p id="demo-note" className="request-note">Demo only: nothing is sent.</p>
      <p className="request-status" role="status">{confirmed}</p>
    </form>
  );
}
