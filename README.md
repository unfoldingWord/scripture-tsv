<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/unfoldingword/next-js-template/public/uwLogo.png">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Scripture TSV</h3>
  <!-- TODO: Implement links to styleguide -->
  <p align="center">
    Library to create and edit TSV resources that pertain to a certain scripture. 
    <!-- <br />
    <a href="https://github.com/unfoldingWord-box3/next-js-template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/unfoldingWord-box3/next-js-template">View Demo</a>
    ·
    <a href="https://github.com/unfoldingWord/scripture-tsv/issues">Report Bug</a>
    ·
    <a href="https://github.com/unfoldingWord/scripture-tsv/issues">Request Feature</a> -->
  </p> 
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- TODO: Input screenshot? -->
<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

**Purpose**

- The purpose of this project is to provide an API to interact with TSV data that pertain to certain scripture passages.

**Problem**

- TSV resources within our applications did not have the ability to add another TSV row. Users had the ability to see existing TSV items (Existing translation notes, translation words, etc.), but did not have the ability to add/delete/move them as needed.

**Background**

- TSV code that existed came from translation-helps-rcl
- There was a function within THelps to create a TSVs object state and then to edit a TSV item. However, there was no functionality to add, delete, or move a TSV item.

<p align="right"><a href="#top">back to top</a></p>

### Built With

- [React.js](https://reactjs.org/)
- [Material UI](https://mui.com/material-ui/)
- [Vite](https://vitejs.dev/)
- [React Styleguidist](https://react-styleguidist.js.org/)

<p align="right"><a href="#top">back to top</a></p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps

### Prerequisites

Things you need to use the software and how to install them.

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation/First Steps

1. Clone the repo

   ```sh
   git clone https://github.com/unfoldingWord/scripture-tsv.git
   ```

> NOTE: alternativiely, the repo may be forked.

2. Install NPM packages

   ```sh
   npm install
   ```

   or

   ```sh
   pnpm install
   ```

### Running the Vite Sandbox

This library has vite installed to use a sandbox for quick development. The vite application will run whatever code is in `src/App.jsx`

1. Edit the `App.jsx` file to contain whatever code you want to test
2. Run the Vite sandbox by running:
   ```sh
   npm run dev
   ```

### Using & Running Styleguide

1. To run a local copy of the styleguide, run

   ```sh
   npm run styleguide
   ```

2. To build the styleguide into a folder called `styleguide`, run

   ```js
   npm run styleguide:build
   ```

### Contributing

1. Create a branch to contain your changes.
2. Make changes, commit, and push to your branch.
3. When changes are complete, create Pull Request (PR) and request they be reviewed and merged.

<p align="right"><a href="#top">back to top</a></p>

<!-- USAGE EXAMPLES -->

## Usage/Integration

<!-- ## Using the Tutorials

TBD... here point to one or more tutorials showing how to use the template to actually develop something useful...

Potential Ideas:

- Using the Bible Reference RCL with Proskomma
- Using the Translation Helps RCL to display content

<p align="right"><a href="#top">back to top</a></p> -->

<!-- ROADMAP -->

## Roadmap

<!-- - [ ] POC
- [ ] Prototype
- [ ] MVP -->

See the [open issues](https://github.com/unfoldingWord/scripture-tsv/issues) for a full list of proposed features (and known issues).

<p align="right"><a href="#top">back to top</a></p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. [Guidelines for external contributions.](https://forum.door43.org)

You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

If you would like to fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature-github_username-AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#top">back to top</a></p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

<p align="right"><a href="#top">back to top</a></p>

<!-- CONTACT -->

## Contact

unfoldingWord - [@unfoldingWord](https://twitter.com/unfoldingWord) - info@unfoldingWord.org

Project Link: [https://github.com/unfoldingWord/scripture-tsv](https://github.com/unfoldingWord/scripture-tsv)

<p align="right"><a href="#top">back to top</a></p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

<!-- - []()
- []()
- []() -->

<p align="right"><a href="#top">back to top</a></p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/unfoldingWord-box3/next-js-template.svg?style=for-the-badge
[contributors-url]: https://github.com/unfoldingWord/scripture-tsv/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/unfoldingWord-box3/next-js-template.svg?style=for-the-badge
[forks-url]: https://github.com/unfoldingWord/scripture-tsv/network/members
[stars-shield]: https://img.shields.io/github/stars/unfoldingWord-box3/next-js-template.svg?style=for-the-badge
[stars-url]: https://github.com/unfoldingWord/scripture-tsv/stargazers
[issues-shield]: https://img.shields.io/github/issues/unfoldingWord-box3/next-js-template.svg?style=for-the-badge
[issues-url]: https://github.com/unfoldingWord/scripture-tsv/issues
[license-shield]: https://img.shields.io/github/license/unfoldingWord-box3/next-js-template.svg?style=for-the-badge
[license-url]: https://github.com/unfoldingWord/scripture-tsv/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: images/screenshot.png
