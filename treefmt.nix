{
  projectRootFile = "flake.nix";

  programs.nixfmt.enable = true;

  programs.prettier = {
    enable = true;

    includes = [
      "**/*.md"
    ];
  };

  programs.shellcheck = {
    enable = true;

    excludes = [ ".envrc" ];
  };
}
