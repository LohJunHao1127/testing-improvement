function isValidEmail(email) {
    // Regular expression pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

function isValidPassword(password) {
    // Regular expression pattern for password validation
    // Returns true if password is valid
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    return passwordRegex.test(password);
}

console.log(isValidEmail('cc@gmail.com'))
console.log(isValidPassword('Cc123'))