{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShellNoCC {
  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];

  shellHook = ''
    find .hooks \
      -maxdepth 1 \
      -type f \
      -name '*.sh' \
      -exec bash -c 'ln -sf "$PWD/$1" ".git/hooks/$(basename "$1" .sh)"' _ {} \;

    npm ci
  '';
}
