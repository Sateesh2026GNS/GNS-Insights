Auth image slider assets
=========================

The Sign In / Sign Up slider (src/components/auth/AuthSlider.jsx) looks for:
  - /auth/slide-1.png  (Production)
  - /auth/slide-2.png  (Analytics)
  - /auth/slide-3.png  (Inventory)

If these files are missing, the slider automatically falls back to themed
gradient slides, so the pages still work.

Three ready-made manufacturing photos were generated for this slider at:
<<<<<<< HEAD
  C:\Users\satee\.cursor\projects\c-Users-satee-OneDrive-Desktop-GNS-Insights\assets\auth-slide-1.png
=======
  C:\Users\satee\.cursor\projects\c-Users-satee-OneDrive-Desktop-SMRT\assets\auth-slide-1.png
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  ...\auth-slide-2.png
  ...\auth-slide-3.png

To use them, copy them into this folder (run from the project root in PowerShell):

<<<<<<< HEAD
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-GNS-Insights\assets\auth-slide-1.png" "frontend\public\auth\slide-1.png"
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-GNS-Insights\assets\auth-slide-2.png" "frontend\public\auth\slide-2.png"
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-GNS-Insights\assets\auth-slide-3.png" "frontend\public\auth\slide-3.png"
=======
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-SMRT\assets\auth-slide-1.png" "frontend\public\auth\slide-1.png"
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-SMRT\assets\auth-slide-2.png" "frontend\public\auth\slide-2.png"
  Copy-Item "$HOME\.cursor\projects\c-Users-satee-OneDrive-Desktop-SMRT\assets\auth-slide-3.png" "frontend\public\auth\slide-3.png"
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

You can also drop in your own images using the same names.
