-- Open birlasoft-hp-field-ai-v1.pptx in Keynote for manual polish + PDF export.
-- Automated export often blocks on Keynote dialogs; prefer manual export after review.
-- Run: osascript scripts/build-birlasoft-hp-deck-keynote.applescript

set projectRoot to "/Users/chandansharma/Documents/New project/"
set pptxPath to projectRoot & "_bmad-output/capabilities/birlasoft-hp-field-ai-v2.pptx"

tell application "Keynote"
	activate
	open POSIX file pptxPath
end tell

return "Opened in Keynote: " & pptxPath & linefeed & "Next: File → Save as Keynote · File → Export To → PDF"
