function update-neutrabize {
    $link = "https://codeload.github.com/najmiter/neutrabize/zip/refs/heads/main"
    $output_zip = "latest.zip"

    Invoke-WebRequest -Uri $link -OutFile $output_zip

    Expand-Archive -Path .\latest.zip -DestinationPath .\neutrabize

    Move-Item -Path .\neutrabize\* -Destination .\

    Remove-Item -Path .\neutrabize -Force -Recurse

}

update-neutrabize
