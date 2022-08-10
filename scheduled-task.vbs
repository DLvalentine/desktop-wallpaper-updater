Dim WinScriptHost
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "C:\Users\david\Documents\Prog\desktop-frontpage\desktop-frontpage.bat" & Chr(34), 0
Set WinScriptHost = Nothing