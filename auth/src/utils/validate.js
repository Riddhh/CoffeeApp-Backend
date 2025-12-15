export function isValidEmail(email = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  export function isValidPassword(pass = "") {
    return String(pass).length >= 6;
  }
  