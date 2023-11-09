export const generateUserId = (previousId: number): string => {
  const newId = previousId + 1
  const uid = newId.toString().padStart(5, '0')
  return uid
}
