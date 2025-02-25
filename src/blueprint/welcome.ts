// src/blueprint/welcome.ts

export const welcomeTemplate = (otp: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .container {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
      }

      .header {
        background-color: #007BFF;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }

      h1 {
        margin: 0;
        font-size: 24px;
      }

      .content {
        padding: 20px;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
      }

      .otp {
        font-size: 36px;
        font-weight: bold;
        color: #007BFF;
        text-align: center;
        margin: 20px 0;
      }

      .footer {
        text-align: center;
        padding: 10px;
        background-color: #f0f0f0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Thank you for registering on stockflo</h1>
      </div>
      <div class="content">
        <p>Here is your OTP code for account verification:</p>
        <p class="otp">${otp}</p>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 stockflo. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;