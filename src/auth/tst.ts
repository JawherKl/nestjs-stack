const jwkToPem = require('jwk-to-pem');

const jwk = {
  kty: 'RSA',
  n: 'ttRZC4hv-MwhyUN_wz_iDuZls4SoVeRPKJxBWQMUgWvJApXKo8zhHCHJfWeykznhIKzFmTa5zvTwq3fX_ez13P2zpEf8GKEr4rW54pTLWLQNPw1hT2e2M8JhT80N3nhLyJibf1Qx8R-vSKIfBXbuTNJOV9nrTaCba0b4RuuHmDdJpKpzKT9Ier_rWq89apC4K7z5LC2LTqlk2Q5VEUxc0dFrfczVkujtqqGhv-obMusD55ZTiGgEU0pJvF1Gci3bSVOPol8n2AZltP2cbDfQR0rgKKqHEd5yI6tpEmozrOdIZuiVkWMmUYUwJv96cDjSlE6V72SFUFdmhMvSvJ3UWQ',
  e: 'AQAB'
};

const pem = jwkToPem(jwk);
console.log(pem);
