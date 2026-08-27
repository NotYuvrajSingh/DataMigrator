To temporarily bypass execution, write:

Set-ExecutionPolicy -Scope Process Bypass
npm -v


This forces the current powershell session to override the execution policy set up by the organisation, and be able to run npm, and other scripts.