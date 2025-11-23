"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is an advanced example for creating icon bundles for Iconify SVG Framework.
 *
 * It creates a bundle from:
 * - All SVG files in a directory.
 * - Custom JSON files.
 * - Iconify icon sets.
 * - SVG framework.
 *
 * This example uses Iconify Tools to import and clean up icons.
 * For Iconify Tools documentation visit https://docs.iconify.design/tools/tools2/
 */
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
// Installation: npm install --save-dev @iconify/tools @iconify/utils @iconify/json @iconify/iconify
var tools_1 = require("@iconify/tools");
var utils_1 = require("@iconify/utils");
var sources = {
    svg: [
    // {
    //   dir: 'src/assets/images/iconify-svg',
    //   monotone: true,
    //   prefix: 'custom',
    // },
    // {
    //   dir: 'emojis',
    //   monotone: false,
    //   prefix: 'emoji',
    // },
    ],
    icons: [
    // 'mdi:home',
    // 'mdi:account',
    // 'mdi:login',
    // 'mdi:logout',
    // 'octicon:book-24',
    // 'octicon:code-square-24',
    ],
    json: [
        // Custom JSON file
        // 'json/gg.json',
        // Iconify JSON file (@iconify/json is a package name, /json/ is directory where files are, then filename)
        require.resolve('@iconify-json/ri/icons.json'),
        {
            filename: require.resolve('@iconify-json/bxl/icons.json'),
            icons: [
                'facebook',
                'twitter',
                'github',
                'google',
                'linkedin',
            ],
        },
        // Custom file with only few icons
        // {
        //   filename: require.resolve('@iconify-json/line-md/icons.json'),
        //   icons: [
        //     'home-twotone-alt',
        //     'github',
        //     'document-list',
        //     'document-code',
        //     'image-twotone',
        //   ],
        // },
    ],
};
// File to save bundle to
var target = (0, node_path_1.join)(__dirname, 'icons.css');
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var dir, err_1, allIcons, sourcesJSON, organizedList, prefix, filename, i, item, filename, content, _a, _b, filteredContent, _loop_1, i, cssContent;
        var _this = this;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    dir = (0, node_path_1.dirname)(target);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, node_fs_1.promises.mkdir(dir, {
                            recursive: true,
                        })];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    return [3 /*break*/, 4];
                case 4:
                    allIcons = [];
                    /**
                     * Convert sources.icons to sources.json
                     */
                    if (sources.icons) {
                        sourcesJSON = sources.json ? sources.json : (sources.json = []);
                        organizedList = organizeIconsList(sources.icons);
                        for (prefix in organizedList) {
                            filename = require.resolve("@iconify/json/json/".concat(prefix, ".json"));
                            sourcesJSON.push({
                                filename: filename,
                                icons: organizedList[prefix],
                            });
                        }
                    }
                    if (!sources.json) return [3 /*break*/, 8];
                    i = 0;
                    _d.label = 5;
                case 5:
                    if (!(i < sources.json.length)) return [3 /*break*/, 8];
                    item = sources.json[i];
                    filename = typeof item === 'string' ? item : item.filename;
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, node_fs_1.promises.readFile(filename, 'utf8')];
                case 6:
                    content = _b.apply(_a, [_d.sent()]);
                    // Filter icons
                    if (typeof item !== 'string' && ((_c = item.icons) === null || _c === void 0 ? void 0 : _c.length)) {
                        filteredContent = (0, utils_1.getIcons)(content, item.icons);
                        if (!filteredContent)
                            throw new Error("Cannot find required icons in ".concat(filename));
                        // Collect filtered icons
                        allIcons.push(filteredContent);
                    }
                    else {
                        // Collect all icons from the JSON file
                        allIcons.push(content);
                    }
                    _d.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    if (!sources.svg) return [3 /*break*/, 12];
                    _loop_1 = function (i) {
                        var source, iconSet;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    source = sources.svg[i];
                                    return [4 /*yield*/, (0, tools_1.importDirectory)(source.dir, {
                                            prefix: source.prefix,
                                        })
                                        // Validate, clean up, fix palette, etc.
                                    ];
                                case 1:
                                    iconSet = _e.sent();
                                    // Validate, clean up, fix palette, etc.
                                    return [4 /*yield*/, iconSet.forEach(function (name, type) { return __awaiter(_this, void 0, void 0, function () {
                                            var svg, err_2;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (type !== 'icon')
                                                            return [2 /*return*/];
                                                        svg = iconSet.toSVG(name);
                                                        if (!svg) {
                                                            // Invalid icon
                                                            iconSet.remove(name);
                                                            return [2 /*return*/];
                                                        }
                                                        _a.label = 1;
                                                    case 1:
                                                        _a.trys.push([1, 6, , 7]);
                                                        // Clean up icon code
                                                        return [4 /*yield*/, (0, tools_1.cleanupSVG)(svg)];
                                                    case 2:
                                                        // Clean up icon code
                                                        _a.sent();
                                                        if (!source.monotone) return [3 /*break*/, 4];
                                                        // Replace color with currentColor, add if missing
                                                        // If icon is not monotone, remove this code
                                                        return [4 /*yield*/, (0, tools_1.parseColors)(svg, {
                                                                defaultColor: 'currentColor',
                                                                callback: function (attr, colorStr, color) {
                                                                    return !color || (0, tools_1.isEmptyColor)(color) ? colorStr : 'currentColor';
                                                                },
                                                            })];
                                                    case 3:
                                                        // Replace color with currentColor, add if missing
                                                        // If icon is not monotone, remove this code
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4: 
                                                    // Optimise
                                                    return [4 /*yield*/, (0, tools_1.runSVGO)(svg)];
                                                    case 5:
                                                        // Optimise
                                                        _a.sent();
                                                        return [3 /*break*/, 7];
                                                    case 6:
                                                        err_2 = _a.sent();
                                                        // Invalid icon
                                                        console.error("Error parsing ".concat(name, " from ").concat(source.dir, ":"), err_2);
                                                        iconSet.remove(name);
                                                        return [2 /*return*/];
                                                    case 7:
                                                        // Update icon from SVG instance
                                                        iconSet.fromSVG(name, svg);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })
                                        // Collect the SVG icon
                                    ];
                                case 2:
                                    // Validate, clean up, fix palette, etc.
                                    _e.sent();
                                    // Collect the SVG icon
                                    allIcons.push(iconSet.export());
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _d.label = 9;
                case 9:
                    if (!(i < sources.svg.length)) return [3 /*break*/, 12];
                    return [5 /*yield**/, _loop_1(i)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 9];
                case 12:
                    cssContent = allIcons
                        .map(function (iconSet) { return (0, utils_1.getIconsCSS)(iconSet, Object.keys(iconSet.icons), { iconSelector: '.{prefix}-{name}' }); })
                        .join('\n');
                    // Save the CSS to a file
                    return [4 /*yield*/, node_fs_1.promises.writeFile(target, cssContent, 'utf8')];
                case 13:
                    // Save the CSS to a file
                    _d.sent();
                    console.log("Saved CSS to ".concat(target, "!"));
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) {
    console.error(err);
});
/**
 * Sort icon names by prefix
 */
function organizeIconsList(icons) {
    var sorted = Object.create(null);
    icons.forEach(function (icon) {
        var item = (0, utils_1.stringToIcon)(icon);
        if (!item)
            return;
        var prefix = item.prefix;
        var prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = []);
        var name = item.name;
        if (!prefixList.includes(name))
            prefixList.push(name);
    });
    return sorted;
}
