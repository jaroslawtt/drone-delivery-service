function configureString(...segments: string[]): string;
function configureString<T extends Record<string, string>>(
  ...parameters: [...string[], T]
): string;
function configureString<T extends Record<string, string>>(
  ...parameters: [...string[], T] | [...string[]]
): string {
  const copiedArguments = [...parameters];
  const lastParam =
    copiedArguments.length > 0 ? copiedArguments.pop() : undefined;
  const isObject =
    lastParam !== undefined &&
    typeof lastParam === "object" &&
    !Array.isArray(lastParam);

  const options = isObject ? (lastParam as T) : undefined;

  if (!isObject && lastParam !== undefined) {
    copiedArguments.push(lastParam as string);
  }

  let result = copiedArguments.join("");

  if (!options) {
    return result;
  }

  for (const [key, value] of Object.entries(options)) {
    result = result.replace(`:${key}`, value);
  }

  return result;
}

export { configureString };
