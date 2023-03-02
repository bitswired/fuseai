with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "node";
    buildInputs = [
	google-cloud-sdk
        nodejs-16_x
        (yarn.override { nodejs = nodejs-16_x ;})
        postgresql
    ];
    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
        export $(xargs <.env)
    '';
}
