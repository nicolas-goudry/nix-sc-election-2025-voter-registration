{
  description = "Nix SC Election 2025 Voter Registration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";

    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      treefmt-nix,
      ...
    }:
    let
      systems = [
        "x86_64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      eachSystem = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
      treefmtEval = eachSystem (pkgs: treefmt-nix.lib.evalModule pkgs ./treefmt.nix);
    in
    {
      # nix flake check
      checks = eachSystem (
        pkgs:
        let
          checks = {
            formatting = treefmtEval.${pkgs.system}.config.build.check self;
          };
        in
        checks
        // {
          all = pkgs.runCommand "all-checks" { buildInputs = builtins.attrValues checks; } "touch $out";
        }
      );

      # nix fmt
      formatter = eachSystem (pkgs: treefmtEval.${pkgs.system}.config.build.wrapper);

      # nix develop
      devShells = eachSystem (pkgs: {
        default = pkgs.callPackage ./shell.nix { };
      });
    };
}
