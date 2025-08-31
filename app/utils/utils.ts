import { routeDictionary } from "@/routes.ts";
import { type RouteConfigEntry } from "@react-router/dev/routes";

const _utils = {
  $objectToUrlString: (query: any) => {
    let result = "";
    Object.keys(query).forEach((item: string, index: number) => {
      result += (index === 0 ? "?" : "&") + item + "=" + query[item];
    });

    return result;
  },
  $isEmpty: (value: any): boolean => value === "" || (!value && value !== 0) || value === null,
  $isNotEmpty: (value: any): boolean => !_utils.$isEmpty(value),
  $remResizing: (params: any) => {
    const options = Object.assign(
      {
        fontSize: 16,
        baseline: 320,
        threshold: 0,
        basedonnarrow: false,
        basedonwide: false,
        dropoff: false,
        alignCenter: true,
        inward: false,
      },
      params,
    );
    const htmlEl = document.getElementsByTagName("html")[0];
    const bodyEl = document.getElementsByTagName("body")[0];

    const windowHeight = window.screen.availHeight;
    const windowWidth = window.screen.availWidth;
    let frontLine = windowWidth;

    const sizeConstraint = function () {
      if (options.basedonnarrow) {
        _utils.$orientationSensor({
          portrait: function () {
            frontLine = window.screen.availWidth;
          },
          landscape: function () {
            frontLine = window.screen.availHeight;
          },
        });
      } else {
        frontLine = window.screen.availWidth;
      }
      let factor = 0;
      if (options.baseline === 0) {
        factor = 1;
      } else if (frontLine <= options.baseline) {
        if (options.inward) {
          factor = frontLine / options.threshold;
        } else {
          factor = frontLine / options.baseline;
        }
      } else if (
        (frontLine > options.baseline && frontLine <= options.threshold) ||
        options.threshold === 0
      ) {
        if (options.threshold >= 0) {
          if (options.inward) {
            factor = frontLine / options.threshold;
          } else {
            factor = frontLine / options.baseline;
          }
        }
        if (options.alignCenter) {
          bodyEl.style.margin = "0";
          bodyEl.style.width = "auto";
        }
      } else if (frontLine > options.threshold) {
        if (options.alignCenter) {
          factor = options.threshold / options.baseline;
          bodyEl.style.margin = "0 auto";
          bodyEl.style.width = options.threshold;
        } else {
          factor = frontLine / options.baseline;
          bodyEl.style.margin = "0";
          bodyEl.style.width = options.threshold;
        }

        if (options.dropoff) {
          htmlEl.style.fontSize = "none";
          return;
        }
      }
      htmlEl.style.fontSize = options.fontSize * factor + "px";

      if (options.dropoff && frontLine > options.threshold) {
        htmlEl.style.fontSize = "";
      }
    };

    if (options.baseline <= 0) {
      options.baseline = 1;
    }
    sizeConstraint();
    window.onresize = () => {
      console.log("==========window.onresize==========");
      sizeConstraint();
    };
  },
  $isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },

  $isWindows: () => {
    return navigator.platform === "Win32";
  },

  $flattenList: (children: RouteConfigEntry[]) => {
    const flattenList: RouteConfigEntry[] = [];
    const looper = (children: RouteConfigEntry[]) => {
      children.forEach((item) => {
        const _item = JSON.parse(JSON.stringify(item));
        _item.children = undefined;

        if (item.children instanceof Array && item.children.length > 0) {
          looper(item.children);
        }
        flattenList.push(_item);
      });
    };
    looper(children);

    return flattenList;
  },
  $findRoutePathById: (routeId: string) => {
    const result: string | undefined = _utils.$getFullRoutePathByRouteId(routeId);
    return result;
  },
  $getFullRoutePathByRouteId: (id: string) => {
    let result: string = "";
    const looper = (children: RouteConfigEntry[]) => {
      children.forEach((item) => {
        if (id === item.id) {
          result += item.path;
        }

        if (item.children instanceof Array && item.children.length > 0) {
          result += item.path;
          looper(item.children);
        }
      });
    };
    looper(routeDictionary);

    return result;
  },
  $completeEachRoutePath: (children: RouteConfigEntry[]) => {
    const result = JSON.parse(JSON.stringify(children));
    const looper = (children: RouteConfigEntry[], parentPath: string | undefined) => {
      children.forEach((item: RouteConfigEntry) => {
        if (parentPath) {
          const parentSlash = parentPath.endsWith("/") ? "" : "/";
          item.path = parentPath + parentSlash + item.path;
        }
        if (item.children instanceof Array && item.children.length > 0) {
          looper(item.children, item.path);
        }
      });
    };
    looper(result, undefined);
    return result;
  },

  $findRouteInfoByPath: (path: string) => {
    const completeRouteDictionary = _utils.$completeEachRoutePath(routeDictionary);
    let result: RouteConfigEntry | undefined;
    const looper = (children: RouteConfigEntry[]) => {
      children.forEach((item: RouteConfigEntry) => {
        if (item.path === path) {
          result = item;
        }
        if (item.children instanceof Array && item.children.length > 0) {
          looper(item.children);
        }
      });
    };
    looper(completeRouteDictionary);
    return result;
  },
} as any;

const utils = _utils;

export default utils;
