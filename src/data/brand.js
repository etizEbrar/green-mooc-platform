// Artwork used on the certificate. A `null` source means the file has not
// been supplied yet: the certificate leaves that slot out entirely rather
// than printing a broken image, so it stays presentable while assets are
// still arriving. Drop the file into public/assets/brand/ and set the path.
//
// Paths go through BASE_URL so they resolve under the GitHub Pages
// subpath as well as at a domain root.
const asset = (file) => (file ? `${import.meta.env.BASE_URL}assets/brand/${file}` : null);

export const brand = {
  euEmblem: asset('eu-cofunded-by-the-eu.png'),

  // Awaiting artwork from the coordinator.
  projectLogo: asset(null),
  signature: asset(null),
  signatory: {
    name: null, // e.g. the coordinator's full name, printed under the signature
    role: 'Project Coordinator, S.I.S.E.R.A. Greece'
  },

  partners: [
    { name: 'S.I.S.E.R.A. Greece', src: asset('partner-sisera.png') },
    // The logo published on officineuropa.eu has a white wordmark meant for
    // dark backgrounds; it would vanish on the certificate. Awaiting a
    // dark-text version.
    { name: 'Officine Europa APS', src: asset(null) },
    // 201x58, taken from mediterraneanpanorama.org: sharp on screen, too
    // small for print. Replace with a partner-supplied file.
    { name: 'Akdeniz Panorama Derneği', src: asset('partner-akdeniz-panorama.jpg') }
  ]
};
