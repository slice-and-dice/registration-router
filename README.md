# Registration Router

## `/newregistration`
* `POST` method.
* Use the following JSON body format with the `POST` request:
  ```
  {
    "registrationData": {
      "exampleField1": true,
      "exampleField2": false,
      "exampleField3": 10,
      "exampleField4": "Additional comments"
    },
    "localAuthority": {
      "id": "MAV",
      "name": "Malvern Hills District Council"
    },
    "answerIds": ["TYPE-001", "TYPE-003", "001", "004", "006"]
  }
  ```

* During the development process, you must add env vars for the following for the Notify service to send an email, rather than fail silently:
  ```
  process.env.NOTIFY_KEY
  process.env.TEMPLATE_ID
  process.env.TEST_EMAIL
  ```