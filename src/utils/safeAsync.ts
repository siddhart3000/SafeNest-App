export async function safeAsync(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (error) {
    console.log(`Async error [${label}]:`, error);
  }
}

