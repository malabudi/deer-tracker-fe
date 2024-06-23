# Deer Tracker FrontEnd - PWA NextJS and ReactJS 

## Initial Local Setup

After cloning this repo, run the following commands

```bash
npm install --global yarn
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
yarn install
npx husky init
```

## Run the App Locally

### Run Local Host
You must build and then run the app afterwards. Building well help run the app quicker by caching and synchronize files. Simple run these two commands when you want to run localhost
```bash
yarn build
yarn dev
```

### Connect Camera with Ngrok
Pick your OS and download ngrok first [here](https://ngrok.com/download).
Once downloaded, run ngrok.exe

Inside the terminal after you run ngrok.exe and enter this command
```bash
ngrok config add-authtoken {CHECK #deer-local-setup IN DISCORD AND ADD AUTH TOKEN HERE}
```
Do not include brackets in the command

Run this command in the folder that has ngrok.exe
By default its in the folder that you extracted the zip when you downloaded it
```bash
ngrok http 3000
```

On your phone join the link you see on the command prompt next to `Forwarding`

Once you enter that link in your phone's browser you will be able to see local host

## Linter

### Running the linter
Here is the command to run the linter:
```bash
yarn lint
```

Running the linter locally is not required since the pipeline will do this automatically for you.

### Let linter format simple things in your code for you
However if you want the lint to fix simple issues for you, run this command.
```bash
yarn lint:fix
```