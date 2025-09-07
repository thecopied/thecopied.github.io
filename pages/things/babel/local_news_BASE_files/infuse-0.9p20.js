var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/*! v0.9 preview 20 - infuse core - Dan Krecichwost */
(function initializeInfuse(window, $) {
  'use strict';
  
  // Known issues:
  // none
  
  // Future:
  //  move event uniqueness check to event runner -- perhaps no longer valid due to message aggregating model
  //  explore using Proxy / __noSuchMethod__ to avoid cost of binding to pluginInstance
  //  improve event management from plugin / pluginInstance
  //  support properties in addition to attributes
  //  ie7/8 performance - higher delay time (now at 400 vs 250 -- need more?)
  //  absolutize URL optimization -- don't use dom?
  //  date comparison on events, e.g. poll
  //  @ and () notation polymorphism for events
  //  ff addon
  //  ff dev vs prod proxy use
  //  switch from passing plugin name as event data to using plugin name as event namespace (makes sense, but could be a perf problem based on jquery namespaces implementation)
  //  support guards without corresponding handlers
  //  use document as target, store true targets elsewhere on event object, do calculation per target
  //  global event handlers as singletons with list of eventModels -- prevent creation of multiple scroll listeners to handle same custom or global event in different plugins
  //  single event internal model
  //  support for media match on all events
  //  execution queue bypass option or insertion at start (alternatively, priority levels / priority queue) (or sync!?)
  //  cache media matcher values temporarily
  //  make fn method name strings (3) exposed and extensible
  //  concept of continuations from plugins as actors
  //  timed throttling as general event feature, @ syntax
  //  findByRole('role1 role2'), findByRole('role1 otherplugin_role2')
  //  for global events, dispatch instead of triggering (performance)
  //  offsets passed into withinViewport method should take precedence
  //  confirm that everything necessary from $.fn is included (sort was missing)
  //  loadByHandler undo event? or standardize custom method that supports custom undo?
  //  done role in any plugin gets event after handler runs?
  //  delayload - even if nothing loaded, run load method? essentially, a notifier that it's done loading regardless of whether anything was actually loaded
  //  delayload - unload
  //  attr(value) first tries the attribute name data-{pluginName}-{value}; if that's missing, then {value} (needs to work for other argument types to attr as well)
  //  account for plugin.global when unregistering
  //  postMessage event + rename media to paren unless in context of media query list listener events
  //  allow registration before instantiation
  //  findBy*, etc should not perform any modifications at all to selected elements
  //  make plugins with custom filenames, e.g. for far expires headers, etc.
  
  function inject(a, b) {
    for (var x in b) if (b.hasOwnProperty(x)) a[x] = b[x];
  }
  
  function executeQueue() {
    if (executing = executionQueue.length) {
      try {
        executionQueue.shift().run();
      } catch(e) {
        i$.log(e);
      }
      executeQueue();
    }
  }
  
  function parseEventString(eventString) {
    var pos = 0,
        lastOther = 0,
        parenStack = 0,
        events = [],
        spaceIndex,
        parenIndex,
        chr;
    while ((chr = eventString.charAt(pos)) || lastOther) {
      if (chr == ' ' && !parenStack || !chr) {
        if (lastOther && (!parenStack || !chr)) {
          events.push(eventString.substr(pos - lastOther, lastOther));
          lastOther = 0;
        }
      } else {  
        ++lastOther;
        if (chr == '(') {
          ++parenStack;
        } else if (chr == ')') {
          if (parenStack > 0) --parenStack;
        }
      }
      pos++;
    };
    return events;
  }
  
  function route(event) {
    
    var type = event.model.trueType;
    
    if (routedEvents[type] == event) return;
    routedEvents[type] = event;
    
    var withinRoot = true,
        currentElement = event.target,
        baseType = event.model.baseType,
        plugins = i$.plugins,
        currentScopes = {},
        elementExecutionStack = [],
        eventExecutionQueue = [],
        removedInstances = [],
        elementExecution,
        removedInstance,
        scope,
        plugin,
        roleData,
        roleList,
        role,
        fullRole,
        rootRole,
        underscoreIndex,
        executionFrame,
        typeHandler,
        handler,
        handlers,
        guards,
        globalHandler,
        routingStopped,
        preventDefault,
        i;
    
    stopRouting = function() {
      routingStopped = true;
    };

    do {
      if ((roleData = currentElement.getAttribute('data-role'))) {
        roleList = roleData.split(' ');
        i = roleList.length;
        do {
          fullRole = roleList[--i];
          if (!fullRole) continue;
          if ((underscoreIndex = fullRole.indexOf('_')) == -1) {
            rootRole = fullRole;
            role = 'root';
          } else {
            rootRole = fullRole.substr(0, underscoreIndex);
            role = fullRole.substr(underscoreIndex + 1);
          }
          if ((globalHandler = i$.globalHandlers[rootRole])) {
            elementExecutionStack.push({
              fullRole: fullRole,
              executed: false,
              handler: undefined,
              currentElement: currentElement,
              rootRole: rootRole,
              role: role,
              globalHandler: globalHandler,
              type: type
            });
          // check !plugin.disabled?
          } else if ((plugin = plugins[rootRole]) && plugin.registered) {
            elementExecution = {
              fullRole: fullRole,
              executed: false,
              handler: undefined,
              currentElement: currentElement,
              rootRole: rootRole,
              role: role,
              scope: (scope = currentScopes[rootRole] || (currentScopes[rootRole] = {
                eventExecutionQueue: eventExecutionQueue
              })),
              plugin: plugin,
              type: type
            };
            elementExecutionStack.push(elementExecution);
            if (plugin && plugin.activeEvents[type] && plugin.activeEvents[type][role]) {
              scope.active = true;
            }
            if (role == 'root' && scope.active && plugin && plugin.registered) {
              scope.root = currentElement;
              removedInstances.push(rootRole);
            }
          }
        } while (i);
        if (i = elementExecutionStack.length) {
          while (elementExecution = elementExecutionStack[--i]) {
            eventExecutionQueue.push(elementExecution);
          }
          elementExecutionStack.length = 0;
        }
        if (i = removedInstances.length) {
          while (removedInstance = removedInstances[--i]) {
            currentScopes[removedInstance] = undefined;
          }
          removedInstances.length = 0;
        }
      }
    } while ((currentElement = currentElement.parentNode) && currentElement.nodeType == 1);
    
    i = -1;
    while (!routingStopped && (executionFrame = eventExecutionQueue[++i])) {
      scope = executionFrame.scope;
      if ((executionFrame.handler = executionFrame.globalHandler) || scope.active && executionFrame.plugin) {
      
        if (executionFrame.plugin) {
          role = executionFrame.role;
          if ((handlers = executionFrame.plugin.handlers)) {
            executionFrame.handler = handlers[type] && handlers[type][role] ||
                                     handlers[baseType] && handlers[baseType][role] ||
                                     handlers['defaults'] && handlers['defaults'][role];
          }
          if ((guards = executionFrame.plugin.guards)) {
            executionFrame.guard = guards[type] && guards[type][role] ||
                                   guards[baseType] && guards[baseType][role] ||
                                   guards['defaults'] && guards['defaults'][role];
          }
        }
        if (executionFrame.handler || executionFrame.guard) {
          executionFrame.run = function runExecutionFrame() {
            var executionFrame = this,
                scope = executionFrame.scope,
                type = event.model.trueType;
            if (!scope || !scope.routingStopped) {
              if (executionFrame.plugin) {
                if (!executionFrame.plugin.activeEvents[type] || !executionFrame.plugin.activeEvents[type]['root'] && !executionFrame.plugin.activeEvents[type][executionFrame.role]) {
                  scope.active = false;
                  scope.deactivated = true;
                  return;
                }
                if (executionFrame.guard && !executionFrame.guard.call(executionFrame.plugin, event, scope.root, executionFrame.currentElement)) {
                  executionFrame.failedGuard = true;
                  return;
                }
                if (!(scope.pluginInstance || (scope.pluginInstance = executionFrame.plugin.getInstance(scope.root)) && (scope.pluginInstance.stopRouting = (function(scope) {
                    return function() {
                      scope.routingStopped = true;
                      return scope.pluginInstance;
                    };
                  })(scope)))) {
                  return;
                }
              }
              executionFrame.executed = true;
              executionFrame.handler.call(scope && scope.pluginInstance, event, executionFrame.currentElement);
            }
            executionFrame = scope = type = undefined;
          }
          executionQueue.push(executionFrame);
        }
      }
    }
    
    if (!executing) executeQueue();

    currentElement = type = baseType = plugins = currentScopes = elementExecutionStack = removedInstances = elementExecution = removedInstance = scope = plugin = roleData = roleList = role = fullRole = rootRole = executionFrame = typeHandler = handler = globalHandler = undefined;
  }
  
  
  var document = window.document,
      i$,
      log,
      old = window.i$,
      urlMap = {},
      callbackLength = 0,
      rAttributeCleanup = /[\n\t\r]/g,
      rSpace = /\s+/,
      rSpaceGlobal = /\s+/g,
      rQueryString = /\??([^\[=&]+)(\[\])?(?:(=)([^&]*))?/g,
      rNS = /(?:\[('|")([^'"\]]+)\1\])|(?:\[([\d]+)\])/g,
      // used to decide whether to call infuse.element.reflow
      forceReflow = $.browser.msie && $.browser.version < 9,
      delayedDocumentClose = forceReflow || $.browser.opera,
      routedEvents = {},
      stopRouting = function stopRouting() {},
      executionQueue = [],
      executing = false,
      attributeNames = ['Role', 'State'],
      jQueryMethodNames = 'find closest filter not has add children next nextAll nextUntil parent parents parentsUntil prev prevAll prevUntil siblings'.split(' '),
      elementMethodNames = 'has not filter add remove toggle'.split(' ');
      
  window.infuse = window.i$ = i$ = $.extend(true, function infuse(plugin, options, callback, path) {
    
    if (!plugin) {
      return;
    } else if (typeof plugin == 'string') {
      if (i$.plugins[plugin] && i$.plugins[plugin].name) {
        plugin = i$.plugins[plugin];
      } else {
        i$.require(true, (path || i$.pluginPath) + plugin + '.js', function() {
          i$(i$.plugins[plugin], options, callback, path);
        });
        return;
      }
    } else {
      if (plugin.name) {
        i$.plugins[plugin.name] = plugin;
      } else {
        return;
      }
    }
    
    if (plugin) {
      
      if (options || !plugin.registered) {
        
        if (plugin.disabled || i$.windowParams['disable-' + plugin.name]) {
          plugin.disabled = true;
          return;
        }
        
        if (!plugin.registered) {

          var runner = i$.runner,
              pluginName = plugin.name,
              dataAttrPrefix = pluginName + '_',
              dataRoleRootSelector = '[data-role~=' + pluginName + ']',
              dataRoleSelectorPrefix = '[data-role~=' + dataAttrPrefix,
              dataStateSelectorPrefix = '[data-state~=' + dataAttrPrefix,
              dataEventNameInfix = ':live![data-role~=' + pluginName,
              dataEventNameSuffix = dataEventNameInfix + ']',
              activeEvents = plugin.activeEvents = {},
              hasEvents = plugin.hasEvents = function hasEvents(events) {
                var eventList,
                    event,
                    role,
                    type,
                    i = -1;
                if (events && typeof events == 'string') {
                  eventList = parseEventString(events);
                  while ((event = eventList[++i])) {
                    if (event.indexOf('!') > 0) {
                      event = event.split('!');
                      type = event[0];
                      role = event[1];
                    } else {
                      type = event;
                      role = 'root';
                    }
                    if (!activeEvents[type] || !activeEvents[type][role]) return false;
                  }
                  return true;
                }
                return false;
              },
              setEvents = plugin.setEvents = function setEvents(events) {
                var eventList,
                    eventModelList,
                    event,
                    eventModel,
                    role,
                    type,
                    i = -1;
                if (events && typeof events == 'string') {
                  eventList = parseEventString(events);
                  eventModelList = [];
                  while ((event = eventList[++i])) {
                    if (event.indexOf('!') > 0) {
                      event = event.split('!');
                      type = event[0];
                      role = event[1];
                      eventModel = i$.run.standardizeEvents(type + dataEventNameInfix + '_' + role + ']')[0];
                    } else {  
                      type = event
                      role = 'root';
                      eventModel = i$.run.standardizeEvents(type + dataEventNameSuffix)[0];
                    }  
                    eventModel.message = pluginName;
                    if (!activeEvents[type] || !activeEvents[type][role]) {
                      eventModelList.push(((activeEvents[type] || (activeEvents[type] = {}))[role] = eventModel));
                    }
                  }
                  if (runner) {
                    runner.setEvents(eventModelList);
                  } else {
                    runner = i$.runner = i$.run(route, eventModelList);
                  }
                }
                return plugin;
              },
              cancelEvents = plugin.cancelEvents = function cancelEvents(events) {
                
                if (!runner) return;
                
                var eventList,
                    eventModelList,
                    event,
                    eventModel,
                    role,
                    type,
                    i = -1,
                    j;
                if (events && typeof events == 'string') {
                  eventList = parseEventString(events);
                  eventModelList = [];
                  while ((event = eventList[++i])) {
                    if (event.indexOf('!') > 0) {
                      event = event.split('!');
                      type = event[0];
                      role = event[1];
                      eventModel = i$.run.standardizeEvents(type + dataEventNameInfix + '_' + role + ']')[0];
                    } else {
                      type = event
                      role = 'root';
                    }
                    if (activeEvents[type] && activeEvents[type][role]) {
                      eventModelList.push(activeEvents[type][role]);
                      activeEvents[type][role] = undefined;
                    }
                  }
                  if (eventModelList.length) {
                    runner.cancel(eventModelList);
                  }
                } else {
                  i = -1;
                  j = -1;
                  while ((event = activeEvents[++i])) {
                    while ((eventModel = event[++j])) {
                      runner.cancel(eventModel);
                    }
                    j = -1;
                  }
                  activeEvents = undefined;
                  delete plugin.activeEvents;
                  delete plugin.runner;
                }
                return plugin;
              },
              dataPlugin = 'data-' + pluginName,
              dataIdAttribute = dataPlugin + '-id',
              dataOptionsAttribute = dataPlugin + '-options',
              dataEventsAttribute = dataPlugin + '-events',
              pluginInstanceConstructor = function pluginInstanceConstructor() {};
      
          plugin.registered = true;
          if (!plugin.instances) plugin.instances = [];
              
          setEvents(plugin.events);
        
          pluginInstanceConstructor.prototype = plugin;
          
          plugin.runner = runner;
          
          plugin.roleSelector = function(role) {
            return role == 'root' ? dataRoleRootSelector : dataRoleSelectorPrefix + role + ']';
          };
          plugin.stateSelector = function(state) {
            return dataStateSelectorPrefix + state + ']';
          };
          plugin.expandRole = function(role) {
            var list = role.split(' '),
                finalList = [],
                i = -1,
                item;
            while ((item = list[++i]) != undefined) {
              if (item) finalList.push(item == 'root' ? pluginName : dataAttrPrefix + item);
            }
            return finalList.join(' ');
          };
          plugin.expandState = function(state) {
            var list = state.split(' '),
                finalList = [],
                i = -1,
                item;
            while ((item = list[++i]) != undefined) {
              if (item) finalList.push(dataAttrPrefix + item);
            }
            return finalList.join(' ');
          };
          
          plugin.unregister = function(root) {
            i$.unregister(plugin, root);
            return plugin;
          };
          
          if (plugin.global) {
            i$.element.toggleRole(document.documentElement, pluginName, true);
          }
          
          plugin.getInstance = function getInstance(root, currentElements) {
          
            if (plugin.disabled) return;
          
            var pluginInstanceId = root[dataIdAttribute],
                pluginInstance = plugin.instances[pluginInstanceId],
                newInstance = !pluginInstance || currentElements,
                existing = pluginInstance,
                pluginOptions,
                pluginInfoHandler,
                element,
                i = -1;
            
            if (newInstance) {
              if (!pluginInstance) {
                root[dataIdAttribute] = pluginInstanceId = plugin.instances.length++;
              }
              pluginInstance = new pluginInstanceConstructor();
              if (!plugin.instances[pluginInstanceId]) {
                plugin.instances[pluginInstanceId] = pluginInstance;
              }
              pluginInstance.id = pluginInstanceId;
              pluginInstance.root = root;
              pluginInstance.plugin = plugin;
              
              if (existing) {
                while ((element = currentElements[++i])) {
                  pluginInstance[i] = element;
                }
                pluginInstance.length = i;
                pluginInstance.info = existing.info;
                pluginInstance.constructor = existing.constructor;
                pluginInstance.stopRouting = existing.stopRouting;
              } else {
                pluginInstance.context = pluginInstance[0] = root;
                pluginInstance.length = 1;
                pluginInstance.constructor = function(elements) {
                  return getInstance(root, elements || []);
                };
                pluginInstance.stopRouting = function(){
                  return pluginInstance;
                };
                pluginInfoHandler = function() {};
                pluginInfoHandler.prototype = plugin.info || (plugin.info = {});
                pluginInstance.info = new pluginInfoHandler();
              }
            }
            
            if (plugin.bindSpecials !== false) {
              inject(pluginInstance, i$.fn);
              inject(pluginInstance, plugin.fn);
            }
          
            if (!currentElements) {
              pluginInstance.info.options = (pluginOptions = root.getAttribute(dataOptionsAttribute)) && (pluginOptions = $.trim(pluginOptions)) ? i$.expandQueryString(pluginOptions) : {};
              
              newInstance && plugin.init && plugin.init.call(pluginInstance);
            }
            
            return existing ? pluginInstance : pluginInstance.getInstance(root, currentElements);
          }
        }
        
        if (options) {
          plugin.setEvents(options);
        }
      }

      if (callback && plugin && plugin.registered && !plugin.disabled) {
        callback(plugin);
      }
      
      return plugin;
    }
  }, old);
  
  i$.old = old;
  i$.jQuery = i$.$ = $;
  i$.constructor = initializeInfuse;
  i$.pluginPath = '/javascripts/plugins/';
  i$.executionQueue = executionQueue;
  i$.windowName = i$.old && i$.old.windowName || 'w0';
  
  log = i$.log = function log() {
    try {
      var console = window.console;
      if (console && console.log) {
        console.log.apply(console, arguments);
      }
    } catch(e) {}
  };
  
  i$.absolutizeUrl = function absolutizeUrl(url) {
    var absoluteUrl = urlMap[url];
    if (absoluteUrl) return absoluteUrl;
    
    var a = document.createElement('a');
    a.href = url;
    return (urlMap[url] = a.href);
  };
  
  i$.expandQueryString = function expandQueryString(queryString, object) {
    var params = typeof object == 'object' ? object : {},
        value;
    if (queryString && typeof queryString == 'string') queryString.replace(rQueryString, function(a, b, c, d, e) {
      value = e === undefined || e === '' ? (d === '=' ? '' : true) : e;
      if (c) {
        (params[b] && params[b].push || (params[b] = [])).push(value);
      } else {
        params[b] = value;
      }
    });
    return params;
  };
  
  i$.callback = function callback(func) {
    i$.callback[callbackLength] = func;
    return 'i$.callback[' + callbackLength++ + ']';
  };
  
  // create and base are optional arguments
  i$.ns = function ns(create, namespaceString, base) {
    var spaces,
        sl,
        i = -1;
    
    if (typeof create != 'boolean') {
      base = namespaceString;
      namespaceString = create;
      create = true;
    }
    
    if (!namespaceString) return;
    if (!base) base = window;
    
    sl = (spaces = (namespaceString += '').replace(rNS, '.$2$3').split('.')).length;
    
    if (create) while (++i < sl) base = base[spaces[i]] || (base[spaces[i]] = {});
    else while (base && (++i < sl)) base = base[spaces[i]];
    
    return base;
  };
  
  i$.unregister = function unregister(plugin, root) {
    
    if (typeof plugin == 'string' && i$.plugins[plugin]) {
      plugin = i$.plugins[plugin];
    }
    
    if (plugin) {
      
      if (root && typeof root == 'object' && root.nodeType === 1) {
        
        var attrName = 'data-' + plugin.name + '-id',
            instanceId = parseInt(root[attrName]),
            pluginInstance;
        if (instanceId > -1) {
          delete root[attrName];
          if ((pluginInstance = plugin.instances[instanceId])) {
            if (pluginInstance.cleanup) pluginInstance.cleanup.call(pluginInstance);
            delete plugin.instances[instanceId]
            delete pluginInstance.root;
            delete pluginInstance[0];
            pluginInstance.stopRouting();
          }
        }
      } else if (plugin.registered) {
        
        plugin.registered = false;
        plugin.cancelEvents();
        
        for (var pluginInstance, pluginInstances = plugin.instances, pil = pluginInstances.length, i = 0; pil < i; i++) {
          pluginInstance = pluginInstances[i++];
          if (pluginInstance.cleanup) pluginInstance.cleanup.call(pluginInstance);
          delete pluginInstance.root[attrName];
          delete pluginInstance.root;
          delete pluginInstance[0];
          pluginInstance.stopRouting();
        }
        delete plugin.instances;
      }
    }
  };
  
  i$.getInstanceId = function getInstanceId(plugin, root) {
    if (typeof plugin === 'string' && i$.plugins[plugin]) {
      plugin = i$.plugins[plugin];
    }
    
    var id;
    if (plugin && typeof root == 'object' && root.nodeType === 1 && typeof (id = root['data-' + plugin.name + '-id']) == 'number') {
      return parseInt(id);
    }
  };
  
  i$.getInstance = function getInstance(plugin, root) {
    
    var instanceId = getInstanceId(plugin, root);
    if (instanceId > -1) return plugin.instances[instanceId];
  };
  
  i$.globalHandlers = {
    // output information related to current pluginInstance and event
    log: function(event, currentElement) {
      i$.log('Event: %o\nCurrent Element: %o\nExecution Queue: %o', event, currentElement, executionQueue);
    },
    // stop event propagation
    stopPropagation: function(event) {
      event.stopPropagation();
    },
    stopImmediatePropagation: function(event) {
      event.stopImmediatePropagation();
    },
    stopRouter: function(event) {
      stopRouting();
    },
    preventDefault: function(event) {
      event.preventDefault();
    }
  };
  
  i$.windowParams = i$.expandQueryString(location.search);
  
  old = i$.require;
  i$.require = (function initializeInfuseRequire() {
    
    var a = arguments,
        windowCount = 1,
        head = function(document) {
          return document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        },
        loadAsync = document.createElement('script').async === true || 'MozAppearance' in document.documentElement.style || window.opera,
        require = $.extend(function require() {

          var a = arguments,
              i;
          
          if ((i = a[0]) && (i = typeof i === 'boolean' ? require.delay : parseInt(i))) {
            setTimeout(function() {
              require.apply(require, Array.prototype.slice.call(a, 1));
            }, i);
            return;
          }
          
          i = a.length-1;
          var hasO = true,
              o = a[i],
              t = typeof o,
              su, b, x;
          
          if (t !== 'object' || o.url) {
            o = {};
          } else {
            --i;
          }
          if (!su && typeof a[i] === 'function') su = a[i--];
          if (su) o.success = su;
          
          b = new ResourceBundle(o);
          
          for (x = 0; x <= i; x++) {
            resourceBundleMethods.addResource.call(b, a[x]);
          }
          b.ready = true;
          resourceBundleMethods.update.call(b);

          return b;
        }, {
          resources: {},
          length: 0,
          resourceBundles: [],
          delay: 100
        }, old),
        resourceMethods = {
          notifyLoaded: function() {
            this.loaded = true;
            var bundles = this.bundles,
                bundle,
                i = -1
            while (bundle = bundles[++i]) {
              if (!bundle.loaded && !bundle.failed) {
                resourceBundleMethods.notifyResourceLoaded.call(bundle);
              }
            }
          },
          notifyFailed: function() {
            this.failed = true;
            var bundles = this.bundles,
                bundle,
                i = -1
            while (bundle = bundles[++i]) {
              if (!bundle.loaded && !bundle.failed) {
                resourceBundleMethods.notifyResourceFailed.call(bundle);
              }
            }
          },
          registerBundle: function(b) {
            this.bundles.push(b);
          }
        }, resourceBundleMethods = {
          addResource: function(o) {
            if (!o) return;
            var url = o, type, force = false, window = this.window, a, i, x, windowName;
            if (typeof o === 'object') {
              url = o.url;
              type = o.type;
              force = o.force;
              o.window && (window = o.window);
            } else if (o.indexOf('!' > -1)) {
              a = o.split('!');
              url = a[0];
              i = 0;
              while ((x = a[++i])) {
                if (x == 'css') {
                  type = 'css';
                } else if (x == 'force') {
                  force = true;
                }
              } 
            }
            // no URL, so no resource to add
            if (!url) return;
            // make sure window has infuse and windowName
            if (!window.i$) {
              window.i$ = window.infuse = {};
            }
            if (!window.i$.windowName) {
              window.i$.windowName = 'w' + windowCount++;
            }
            windowName = window.i$.windowName;
            // make sure URL is absolute -- ensures only one instance of a resource on page
            url = i$.absolutizeUrl(url);
            // if the library already knows of the resource
            var r = (Resource.collection[windowName] || (Resource.collection[windowName] = {}))[url];
            if (r) {
              if (force || r.failed) {
                this.loaded = false;
                ++this.loading;
                r.type == 'js' ? createScript_(r) : createLink_(r);
              } else if (!r.loaded) {
                this.loaded = false;
                ++this.loading;
              }
            } else {
              r = new Resource(null, url, type, !loadAsync && this.loading > 1, window);
              if (!r.loaded) {
                this.loaded = false;
                ++this.loading;
              }
            }
            this[this.length++] = r;
            resourceMethods.registerBundle.call(r, this);
          },
          notifyResourceLoaded: function() {
            if (--this.loading <= 0) {
              this.loaded = true;
              resourceBundleMethods.update.call(this);
            }
          },
          notifyResourceFailed: function() {
            if (--this.loading <= 0) {
              this.failed = true;
              resourceBundleMethods.update.call(this);
            }
          },
          update: function() {
            var t = this;
            if (t.ready && !t.executed) {
              if (t.loaded) {
                if (t.success) t.success();
                t.executed = true;
              } else if (t.failed) {
                if (t.failure) t.failure();
              }
            }
          }
        };
    
    
    function ResourceBundle(o) {
      $.extend(this, o);
      this.collection.push(this);
    };
    ResourceBundle.prototype = {
      collection: (ResourceBundle.collection = require.resourceBundles),
      loaded: true,
      loading: 0,
      failed: false,
      executed: false,
      length: 0,
      toArray: function() {
    		return Array.prototype.slice.call(this);
    	},
    	splice: [].splice,
    	window: window
    };
    
    function Resource(element, url, type, noExecute, window) {
      var t = this, c;
      t.bundles = [];
      if (window) t.window = window;
      window = t.window;
      if (!window.i$) {
        window.i$ = window.infuse = {};
      }
      if (!window.i$.windowName) {
        window.i$.windowName = 'window-' + windowCount++;
      }
      c = t.collection[t.window.i$.windowName] || (t.collection[t.window.i$.windowName] = {});
      if (element) {
        if (!url) url = i$.absolutizeUrl(element.src || element.href);
        t.element = element;
        c[(t.url = url)] = t;
        t.type = element.nodeName == 'SCRIPT' ? 'js' : 'css';
        t.noExecute = element.type && /^text\/(?:javascript|css)$/.test(element.type);
        t.loaded = true;
      } else {
        c[(t.url = url)] = t;
        t.type = type || /[^?]*?\.css(?:\?|$)|!css/.test(url) ? 'css' : 'js';
        t.noExecute = noExecute;
        t.element = (t.type == 'js' ? createScript_ : createLink_)(t);
      }
    }
    Resource.prototype = {
      collection: (Resource.collection = require.resources),
      loaded: false,
      failed: false,
      window: window
    };
    
    function eventAttach_(s, r) {
      function g() {
        resourceMethods.notifyLoaded.call(r);
      }
      function f() {
        resourceMethods.notifyFailed.call(r);
      }
      if (s.addEventListener) {
        s.addEventListener('load', g, false);
        s.addEventListener('error', f, false);
      } else if (s.attachEvent) {
        s.attachEvent('onreadystatechange', function(e) {
          var t = e.srcElement;
          if (!r.loaded && (/loaded|complete/.test(t.readyState))) {
            g();
          }
        });
        s.attachEvent('onerror', f);
      }
    }
    
    function createScript_(r) {
      var s = r.window.document.createElement('script');
      eventAttach_(s, r);
      s.src = r.url;
      s.async = true;
      head(r.window.document).appendChild(s);
      return s;
    }
    
    function createLink_(r) {
      var s, b = $.browser, document = r.window.document;
      if (b.mozilla) {
        s = document.createElement('style');
        s.textContent = '@import "' + r.url + '"';
      } else {
        s = document.createElement('link');
        s.rel = 'stylesheet';
        s.href = r.url;
      }  
      if (r.media) s.media = r.media;
      if (b.msie || b.opera) {
          eventAttach_(s, r);
      } else {
        var x, g, o = {
          success: function() {
            resourceMethods.notifyLoaded.call(r);
          },
          failure: function() {
            resourceMethods.notifyFailed.call(r);
          },
          maxRuns: 200
        };
        if (b.webkit) {
          i$.run(true, function() {
            var i = 0, h = s.href, l = document.styleSheets;
            while ((x = l[i++])) if (x.href == h) return true;
          }, 'poll@50', o);
        } else {
          i$.run(true, function() {
            try {
              return (g || (g = (x || (x = s.sheet || s.styleSheet)).cssRules || x.rules)) && g.length > 0;
            } catch(e) {
              return (e.code == 1000) || (/security|denied/i.test(e.message));
            }
          }, 'poll@50', o);
        }
      }
      head(r.window.document).appendChild(s);
      return s;
    }
    
    var s, i = 0, ss = $('script[src], link[rel="stylesheet"]'), url, rs = require.resources;
    while ((s = ss[i++])) {
      url = i$.absolutizeUrl(s.src || s.href);
      if (url && !rs[url]) {
        new Resource(s, url);
      }
    }
    
    return require;
  })();
  
  // TODO fix event propagation
  old = i$.run;
  i$.run = (function() {
    var a = arguments,
        useTimeStamp,
        rLive = /^([^\s]+?)?(:live)?$/,
        rGlobal = /^(window|document)_([\w\W]+)$/,
        rParen = /^([^\(]+)\(([\w\W]+)\)$/,
        rInterval = /^([^@]+)@([\d]+)$/,
        rMediaQuery = /^\s*\(\s*(?:((?:min|max)-(?:width|height))\s*:\s*(\d+)px|(orientation)\s*:\s*(landscape|portrait))/,
        slice = Array.prototype.slice,
        matchMedia = window.matchMedia && window.matchMedia('only all').matches && window.matchMedia,
        mediaQueryListListenerSupport = matchMedia && matchMedia('only all').addListener,
        mediaQueryListListenerFail = $.browser.webkit,
        mediaQueryListListenerFailSheet,
        mediaQueryListListenerFailHandled,
        mediaAddListener = function(handler) {
          var item = this.handlerItem;
          if (matchMediaList.length == 0) {
            $(window).bind('resize', matchMediaHandler);
            $(window).bind('orientationchange', matchMediaHandler);
          }
          if (item) {
            item.handlers.push(handler);
          } else {
            item = this.handlerItem = {
              currentlyMatches: this.matches(),
              matcher: this,
              handlers: [handler]
            };
            matchMediaList.push(item);
          }
        },
        mediaRemoveListener = function(handler) {
          var item = this.handlerItem,
              boundHandler,
              i;
          if (item) {
            for (i = -1; item.handlers[++i] != handler;);
            item.handlers.splice(i, 1);
          }
          if (item.handlers.length == 0) {
            for (i = -1; matchMediaList[++i] != item;);
            matchMediaList.splice(i, 1);
            this.handlerItem = undefined;
          }
          if (matchMediaList.length == 0) {
            $(window).unbind('resize', matchMediaHandler);
            $(window).unbind('orientationchange', matchMediaHandler);
          }
        },
        matchMediaListener,
        matchMediaList = [],
        matchMediaHandler = function() {
          for (var mediaItem, handler, j, i = -1; mediaItem = matchMediaList[++i];) {
            if (mediaItem.currentlyMatches != mediaItem.matcher.matches()) {
              mediaItem.currentlyMatches = !mediaItem.currentlyMatches;
              for (j = -1; mediaItem.handlers[++j](mediaItem.currentlyMatches););
            }
          }
        },
        mediaMatchers = {
          'max-width': function(val) {
            return val >= (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
          },
          'max-height': function(val) {
            return val >= (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
          },
          'min-width': function(val) {
            return val <= (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
          },
          'min-height': function(val) {
            return val <= (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
          },
          'max-device-width': function(val) {
            return val >= window.screen.width;
          },
          'max-device-height': function(val) {
            return val >= window.screen.height;
          },
          'min-device-width': function(val) {
            return val <= window.screen.width;
          },
          'min-device-height': function(val) {
            return val <= window.screen.height;
          },
          orientation: function(val) {
            if (window.orientation != undefined) {
              return window.orientation % 180 == (val == 'landscape' ? 0 : 90);
            } else {
              var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                  height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
              return val == 'landscape' ? width >= height : width <= height
            }
          }
        },
        mediaQuery = matchMedia && (!mediaQueryListListenerFail || !mediaQueryListListenerSupport) ? (mediaQueryListListenerSupport ? function mediaQuery(media) {
            var matcher = matchMedia(media);
            return {
              media: media,
              addListener: function(handler) {
                // hack for https://bugs.webkit.org/show_bug.cgi?id=75903 to work
                // however, chance of tab crash each time listener fires
                // we should except that patch to go out soon
                if (mediaQueryListListenerFail && !(mediaQueryListListenerFailHandled || (mediaQueryListListenerFailHandled = {}))[media]) {
                  if (!mediaQueryListListenerFailSheet) {
                    mediaQueryListListenerFailSheet = document.createElement('style');
                    mediaQueryListListenerFailSheet.rel = 'stylesheet';
                    mediaQueryListListenerFailSheet.media = 'all';
                    document.getElementsByTagName('head')[0].appendChild(mediaQueryListListenerFailSheet);
                  }
                  if (mediaQueryListListenerFailSheet.sheet.insertRule) {
                    mediaQueryListListenerFailHandled[media] = true;
                    mediaQueryListListenerFailSheet.sheet.insertRule('@media ' + media + ' {html{ }}', 0);
                  }
                }
                matcher.addListener(handler);
              },
              removeListener: function(handler) {
                matcher.removeListener(handler);
              },
              matches: function() {
                return matcher.matches;
              }
            }
          } : function mediaQuery(media) {
            return {
              media: media,
              addListener: mediaAddListener,
              removeListener: mediaRemoveListener,
              matches: function() {
                return matchMedia(media).matches;
              }
            }
          }) : function mediaQuery(media) {
          var mediaList = media.split(','),
              mediaQueryList = [],
              mediaItemList,
              mediaQueryComponentList,
              mediaItem,
              matchedQuery,
              query,
              i,j;
          for (i = -1; query = mediaList[++i];) {
            mediaItemList = query.split(' and ');
            if (mediaItemList.length) {
              mediaQueryComponentList = null;
              for (j = -1; mediaItem = mediaItemList[++j];) {
                if (matchedQuery = mediaItem.match(rMediaQuery)) {
                  (mediaQueryComponentList || (mediaQueryComponentList = [])).push(matchedQuery);
                }
              }
              if (mediaQueryComponentList) mediaQueryList.push(mediaQueryComponentList);
            }
          }
          
          return {
            media: media,
            addListener: mediaAddListener,
            removeListener: mediaRemoveListener,
            matches: function() {
              var mediaItem,
                  matchedQuery,
                  matches,
                  index,
                  i, j;
              for (i = -1; mediaItem = mediaQueryList[++i];) {
                matches = true;
                for (j = -1; matchedQuery = mediaItem[++j];) {
                  index = 0;
                  while (index < matchedQuery.length && !matchedQuery[++index]);
                  if (!mediaMatchers[matchedQuery[index]](matchedQuery[index + 1])) {
                    matches = false;
                  }
                }
                if (matches) return true;
              }
              
              return false;
            }
          }
        },
        run = $.extend(true, function run() {
          var a = arguments,
              testImmediately = false,
              i = 0,
              options = a[a.length - 1],
              test = a[0];
              
          if (typeof options !== "object") options = {};
          
          if (typeof test === "boolean") {
            testImmediately = test;
            test = a[++i];
          }
          options.testImmediately = testImmediately;

          if (!(options.test = test) || !(options.events = a[++i])) return;
          return new Runner(options);
        }, {
          delay: forceReflow ? 400 : 250,
          // TODO consolidate boilerplate of custom event set and cancel methods
          customEvents: {
            poll: {
              set: function(eventModel, handler) {
                eventModel.id = setInterval((eventModel.customHandler = function pollHandler() {
                  triggerGlobalEvent(eventModel);
                  //$(eventModel.target).trigger(eventModel.type);
                }), eventModel.interval || eventModel.runner.delay);
              },
              cancel: function(eventModel) {
                clearInterval(eventModel.id);
              }
            },
            timeout: {
              set: function(eventModel, handler) {
                (function runTimeout() {
                  eventModel.id = setTimeout((eventModel.customHandler = function timeoutHandler() {
                    runTimeout();
                    triggerGlobalEvent(eventModel);
                  }), eventModel.interval || eventModel.runner.delay);
                })();
              },
              cancel: function(eventModel) {
                clearTimeout(eventModel.id);
              }
            },
            timedscroll: {
              set: function(eventModel, handler) {
                var lastTimeStamp,
                    newTimeStamp,
                    timeOffset;
                if (!eventModel.interval) eventModel.interval = eventModel.data[0] || eventModel.runner.delay;
                
                $(window).bind('scroll', (eventModel.customHandler = function timedscrollHandler(e) {
                  if (!eventModel.id) {
                    if (useTimeStamp == undefined) useTimeStamp = e.timeStamp > 0;
                    if (!lastTimeStamp || (timeOffset = (newTimeStamp = (useTimeStamp ? e.timeStamp : (new Date).getTime())) - lastTimeStamp) > eventModel.interval) {
                      triggerGlobalEvent(eventModel);
                      lastTimeStamp = newTimeStamp || (useTimeStamp ? e.timeStamp : (new Date).getTime());
                    } else {
                      eventModel.id = setTimeout(function() {
                        lastTimeStamp = (useTimeStamp ? e.timeStamp : (new Date).getTime());
                        eventModel.id = undefined;
                        triggerGlobalEvent(eventModel);
                      }, eventModel.interval - timeOffset);
                    }
                  }
                }));
              },
              cancel: function(eventModel) {
                clearTimeout(eventModel.id);
                $(window).unbind('scroll', eventModel.customHandler);
              }
            },
            matchMedia: {
              set: function(eventModel, handler) {
                (eventModel.mediaQueryList = mediaQuery(eventModel.media)).addListener((eventModel.customHandler = function(event) {
                  //i$.log(window.innerWidth, eventModel.mediaQueryList.matches(), eventModel.media)
                  triggerGlobalEvent(eventModel, undefined, {matches: eventModel.mediaQueryList.matches()}, event.target && event.target.nodeType == 1 && $(event.target));
                }));
                $(document).bind('updateMatchMedia', eventModel.customHandler);
              },
              cancel: function(eventModel) {
                eventModel.mediaQueryList.removeListener(eventModel.customHandler);
                $(document).unbind('updateMatchMedia', eventModel.customHandler);
              }
            }
          },
          runners: [],
          standardizeEvents: function(events) {
            return _standardizeEvents(events);
          }
        }, old);
    
    function Runner(options) {
      var runner = this;
      $.extend(runner, options);
      run.runners.push(runner);
      runner.setEvents(runner.events);
    }
    
    Runner.prototype = {
      delay: run.delay,
      collection: run.runners,
      runs: 0,
      cancel: function(events) {
        
        var eventHash = this.eventHash,
            eventData,
            eventModel,
            eventHashModel,
            i = -1;
        
        if (events) {
          events = _standardizeEvents(events);
          while((eventModel = events[++i])) {
            
            !(eventHashModel = eventHash[eventModel.toString()]).canceled &&
            eventHashModel.cancel &&
            eventHashModel.cancel();
          }
        } else {
          for (var key in eventHash) {
            eventHash.hasOwnProperty(key) && eventHash[key].cancel && eventHash[key].cancel();
          }
        }
      },
      setEvents: function(events) {
        var runner = this,
            eventHash = runner.eventHash || (runner.eventHash = {}),
            eventTypeHash = runner.eventTypeHash || (runner.eventTypeHash = {}),
            eventSelectorHash = runner.eventSelectorHash || (runner.eventSelectorHash = {}),
            eventTypeSelector = runner.eventTypeSelector || (runner.eventTypeSelector = {}),
            eventModel,
            eventData,
            eventString,
            i = -1;
        
        events = _standardizeEvents(events);
        
        while ((eventData = events[++i])) {
          if ((eventModel = _createEventModel(eventData, runner))) {
            eventModel.hashKey = eventString = eventModel.toString();
            if (runner.events) {
              runner.events = runner.events + '|' + eventString;
            } else {
              runner.events = eventString;
            }
            eventHash[eventString] = eventModel;
            _setEvent(eventModel);

            if (runner.testImmediately && !runner.completed) {
              eventModel.trigger();
            }
          }
        }
        
        if (!runner.events) {
          runner.events = events;
        }
      }
    };

    function EventModel(eventData) {
      inject(this, eventData);
    }
    
    EventModel.prototype = {
      cancel: function() {
        _cancelEvent(this);
      },
      trigger: function(target) {
        _triggerEvent(this, target);
      },
      toString: function() {
        
        var eventModel = this,
            str = eventModel.trueType,
            data = eventModel.data,
            datalength = data.length;
        
        if (eventModel.live) {
          str += ':live';
        }
        
        if (typeof eventModel.target == 'string') {
          str += '!' + eventModel.target;
        }
        
        if (datalength > 0) {
          for (var x = 0; x < datalength; x++) {
            str += '!' + data[x];
          }
        }
        
        return str;
      }
    };
    
    function _createEventModel(eventData, runner) {
      eventData.runner = runner;
      if (eventData.type) {
        eventData.customEvent = run.customEvents[eventData.baseType];
        return new EventModel(eventData);
      }
    }
    
    function _setEvent(eventModel) {
      
      var runner = eventModel.runner,
          relatedModelArray,
          live = eventModel.live,
          maxRuns = runner.maxRuns,
          extendedTarget,
          relatedModel,
          i = 0,
          success,
          failure,
          handler = function runHandler(event) {
              var data = slice.call(arguments);
              if (data[1]===undefined && eventModel.message) {
                data[1] = eventModel.message;
              }
              ++runner.runs;
              event.model = eventModel;
              if ((success = runner.test.apply(eventModel, data)) || (failure = maxRuns && (runner.runs >= maxRuns))) {
                if (!runner.completed) {
                  if (success) {
                    if (runner.success) runner.success(this);
                  } else if (failure) {
                    runner.failed = true;
                    if (runner.failure) runner.failure(this);
                  }
                  runner.completed = true;
                }
                runner.cancel();
              }
            };
      $(eventModel.target)[(live ? 'live' : 'bind')](eventModel.type, (eventModel.handler = handler));
      
      if (eventModel.customEvent) {
        eventModel.customEvent.set(eventModel, handler);
      } else if (eventModel.global) {
        _setGlobalEvent(eventModel);
      }
      eventModel.canceled = false;
    }
    
    function _cancelEvent(eventModel) {
      if (!eventModel.canceled) {
        eventModel.canceled = true;
        
        $(eventModel.target)[(eventModel.live ? 'die' : 'unbind')](eventModel.type, eventModel.handler);
        
        if (eventModel.customEvent) {
          eventModel.customEvent.cancel(eventModel);
        } else if (eventModel.global) {
          _cancelGlobalEvent(eventModel);
        }
      }
    }
    
    function triggerGlobalEvent(eventModel, data, mergeData, $targetList) {
      var target,
          event,
          i = -1;
      if (!$targetList) $targetList = $(eventModel.target);
      while ((target=$targetList[++i])) {
        event = new $.Event(eventModel.type);
        if (mergeData) inject(event, mergeData);
        event.target = target;
        $.event.trigger(event, data, document, true);
      }
    }
    
    function _setGlobalEvent(eventModel) {
      $(eventModel.global || window).bind((eventModel.baseType || (eventModel.baseType = eventType.substring(6))), (eventModel.handler = function(event) {
        triggerGlobalEvent(eventModel, Array.prototype.slice(arguments, 1), {
          originalEvent: event.originalEvent
        });
      }));
    }
    
    function _cancelGlobalEvent (eventModel) {
      $(eventModel.global || window).unbind(eventModel.baseType, eventModel.handler);
    }
    
    function _triggerEvent(eventModel, target) {
      $(target || eventModel.target).trigger(eventModel.type);
    }
    
    function _eventModelEquals(current, target) {
      return current.type == target.type &&
        current.live == target.live &&
        current.target == target.target &&
        current.timedType == target.timedType;
    }
    
    function _standardizeEvents(events) {
      
      if (!events) return;
      
      // events may be in string, object or array format; strings and objects are converted to arrays
      if (typeof events == 'string') {
        // pipe-separated serialized event string 
        events = events.split('|');
      } else if (!$.isArray([])) {
        // single event as object
        events = [events];
      }
      
      var eventData,
          i = -1;
      while ((eventData = events[++i])) {
        if (typeof eventData == 'string') {
          var eventDataArray = eventData.split('!'),
              eventName = eventDataArray.shift(),
              eventData = {
                data: eventDataArray
              },
              eventWindow,
              eventParen,
              eventInterval,
              eventType,
              liveIndex,
              parenVal,
              intervalNum;
          if (eventName) {
            eventType = eventName;
            if (eventType.indexOf(':live') == (liveIndex = eventName.length - 5)) {
              eventData.live = true;
              eventType = eventType.substr(0, liveIndex);
            }
            eventData.baseType = eventData.type = eventType;
            if ((eventInterval = eventType.match(rInterval)) && (intervalNum = eventInterval[2])) {
              eventData.timedType = eventType;
              eventData.baseType = eventInterval[1];
              eventData.interval = intervalNum;
            }
            if ((eventParen = eventData.baseType.match(rParen)) && (parenVal = eventParen[2])) {
              eventData.parenParam = eventData.media = parenVal;
              eventData.baseType = eventParen[1];
            }
            if ((eventWindow = eventType.match(rGlobal))) {
              eventData.global = window[eventWindow[1]];
              eventData.baseType = eventWindow[2];
            }
          }
          eventData.target = eventData.currentTarget = $.trim(eventDataArray.shift());
        } else {
          if (eventData.standardized) continue;
          eventData.baseType = eventData.type;
          if (eventData.media && !rParen.test(eventData.type)) {
            eventData.type += '(' + eventData.interval + ')';
          }
          if (eventData.interval && !rInterval.test(eventData.type)) {
            eventData.timedType = eventData.type += '@' + eventData.interval;
          }
        }
        if (eventData.interval) {
          eventData.data[0] = eventData.interval;
        } else if (eventData.data[0]) {
          eventData.interval = eventData.data[0];
        }
        
        if (eventData.interval && !eventData.timedType) {
          eventData.timedType = eventData.baseType + '@' + eventData.interval;
        }
        
        eventData.trueType = eventData.minifiedType = eventData.fullType = eventData.type;
        
        if (eventData.live) {
          eventData.fullType += ':live';
        }
        
        if (rSpace.test(eventData.trueType)) {
          eventData.type = eventData.minifiedType = eventData.type.replace(rSpaceGlobal, '');
        }
        
        // the target is missing; default to document
        if (!eventData.target) eventData.target = document;
        if (!eventData.currentTarget) eventData.currentTarget = eventData.target;
        // live only works for selectors; turn it off if the target isn't a string
        if (eventData.live && !(typeof eventData.target == 'string')) eventData.live = false;
        
        if (i$.run.customEvents[eventData.baseType]) {
          eventData.custom = true;
          i$.run.customEvents[eventData.baseType].process && i$.run.customEvents[eventData.baseType].process(eventData);
        }
        
        eventData.toString = EventModel.prototype.toString;
        
        eventData.standardized = true;
        
        events[i] = eventData;
      }
      
      return events;
    }
    
    return run;
  })();
  
  old = i$.element;
  i$.element = $.extend(true, {
    withinViewport: function($element, topBuffer, bottomBuffer) {
      var options = i$.expandQueryString($element.attr('data-withinViewport-options'));
      topBuffer = +(options.topOffset || options.offset || topBuffer || 0);
      bottomBuffer = +(options.bottomOffset || options.offset || bottomBuffer || 0);
      // TODO need pageYOffset for iDevices?
      var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop,
          scrollBottom = scrollTop + (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
          elementTopOffset = $element.offset().top;

      return scrollBottom > elementTopOffset - topBuffer && scrollTop < elementTopOffset + $element.outerHeight() + bottomBuffer;
    },
    outerHtml: function(element, html) {
      if (typeof element == 'object' && element.nodeType === 1) {
        var nodeContainer = document.createElement('div'),
            fragment,
            nodes,
            i = -1;
        if (html && html.nodeName) {
          fragment = html;
        } else {
          fragment = document.createDocumentFragment()
          nodeContainer.innerHTML = html;
          nodes = nodeContainer.childNodes;
          while ((++i) < nodes.length) {
            fragment.appendChild(nodes[i].cloneNode(true));
          }
        }
        element.parentNode.replaceChild(fragment, element);
      }
    },
    innerHtml: function(element, html) {
      $(element).html(html);
    },
    append: function(element, content) {
      $(element).append(content);
    },
    hasAttributeSpacedValue: function(elements, attributeName, value) {
      return (elements = elements[0] || elements) && (' ' + (elements.getAttribute ? elements.getAttribute(attributeName) : elements[attributeName]) + ' ').indexOf(' ' + value + ' ') > -1;
    },
    addAttributeSpacedValue: function(elements, attributeName, value) {
      i$.element.toggleAttributeSpacedValue(elements, attributeName, value, true);
    },
    removeAttributeSpacedValue: function(elements, attributeName, value) {
      i$.element.toggleAttributeSpacedValue(elements, attributeName, value, false);
    },
    toggleAttributeSpacedValue: function(elements, attributeName, value, force) {
      if (elements && typeof elements == 'object') {
        
        if (typeof elements.length != 'number') {
          elements = [elements];
        }
        
        if (typeof force != 'boolean') {
          force = undefined;
        }
        
        if (value && (typeof value == 'string' || (value = value + ''))) {
          var values,
              attributeValue,
              finalAttributeValue,
              currentAttributeValue,
              valueItem,
              spacedValueItem,
              hasValueItem,
              remove,
              element;

          for (var i = 0, el = elements.length; i < el; i++) {
            element = elements[i];
            if (typeof element == 'object' && element.nodeType === 1) {
              attributeValue = element.getAttribute(attributeName);
              finalAttributeValue = currentAttributeValue = attributeValue ? (' ' + attributeValue + ' ').replace(rAttributeCleanup, ' ') : '';
              for (var j = 0, vl = (values || (values = value.split(rSpace))).length; j < vl; j++) {
                if ((valueItem = values[j])) {
                  spacedValueItem = ' ' + valueItem + ' ';
                  hasValueItem = ~finalAttributeValue.indexOf(spacedValueItem);
                  remove = force != undefined ? !force : hasValueItem;
                  if (remove && hasValueItem) {
                    finalAttributeValue = finalAttributeValue.replace(spacedValueItem, ' ')
                  } else if (!remove && !hasValueItem) {
                    finalAttributeValue = finalAttributeValue + spacedValueItem;
                  }
                }
    					}
              if (finalAttributeValue != currentAttributeValue) {
                finalAttributeValue = $.trim(finalAttributeValue.replace(rSpaceGlobal, ' '));
                if (finalAttributeValue) {
                  element.setAttribute(attributeName, finalAttributeValue);
                } else {
                  element.removeAttribute(attributeName);
                }
                if (forceReflow) i$.element.forceReflow(element);
              }
            }
          }
        } else {
          for (var i = 0, el = elements.length; i < el; i++) {
            element = elements[i];
            if (typeof element == 'object' && element.nodeType === 1) {
              element.removeAttribute(attributeName);
              if (forceReflow) i$.element.forceReflow(element);
            }
          }
        }
      }
    },
    findByRole: function(state, scope) {
      return $('[data-role~=' + state + ']', scope);
    },
    findByState: function(role, scope) {
      return $('[data-state~=' + role + ']', scope);
    },
    hasRole: function(elements, role) {
      return i$.element.hasAttributeSpacedValue(elements, 'data-role', role);
    },
    addRole: function(elements, role) {
      i$.element.addAttributeSpacedValue(elements, 'data-role', role);
    },
    removeRole: function(elements, role) {
      i$.element.removeAttributeSpacedValue(elements, 'data-role', role);
    },
    toggleRole: function(elements, role, force) {
      i$.element.toggleAttributeSpacedValue(elements, 'data-role', role, force);
    },
    hasState: function(elements, state) {
      return i$.element.hasAttributeSpacedValue(elements, 'data-state', state);
    },
    addState: function(elements, state) {
      i$.element.addAttributeSpacedValue(elements, 'data-state', state);
    },
    removeState: function(elements, state) {
      i$.element.removeAttributeSpacedValue(elements, 'data-state', state);
    },
    toggleState: function(elements, state, force) {
      i$.element.toggleAttributeSpacedValue(elements, 'data-state', state, force);
    },
    roleSelector: function(role) {
      return '[data-role~=' + role + ']';
    },
    stateSelector: function(state) {
      return '[data-state~=' + role + ']';
    },
    // Use to force IE7 to reflow when style is affected by changes to attributes other than style, class, and id
    forceReflow: forceReflow ? function(element) {
      element.className = element.className;
    } : $.noop,
    loadByHandler: function(items, type, method) {
      var item,
          itemType,
          itemMethod,
          i = -1,
          loadHandler,
          methodName,
          filter,
          dataUrl;
      if (items.nodeType) items = [items];
      while ((item = items[++i])) {
        itemType = type || item.nodeName == 'IMG' && 'img' || item.getAttribute('data-load-type') || (dataUrl = item.getAttribute('data-url')) && (dataUrl.indexOf('callback=') == dataUrl.length - 9 ? 'require' : 'ajax') || item.childNodes.length == 0 && 'method' || 'comment';
        if (itemType == 'noop') {
          continue;
        }
        loadHandler = i$.element.loadHandlers[itemType] || i$.ns(false, itemType);
        methodName = null;
        if (loadHandler || notifyOnly) {
          if ((itemMethod = method) || (methodName = item.getAttribute('data-load-method'))) {
            if (typeof itemMethod == 'string') methodName = itemMethod;
            if (methodName) itemMethod = i$.element[methodName] || i$.ns(false, methodName);
            itemMethod = typeof itemMethod == 'function' ? itemMethod : null;
          }
          if (filter = item.getAttribute('data-load-filter')) {
            filter = i$.element.loadFilters[filter] || i$.ns(false, filter);
          }
          loadHandler(item, itemMethod || i$.element.outerHtml, itemMethod, filter);
        }
      }
    },
    loadHandlers: {
      comment: function(item, method, specifiedMethod, filter) {
        var commentNode,
            nodes = item.childNodes,
            i = -1;
        while((commentNode = nodes[++i])) {
          if (commentNode.nodeType == 8) {
            method(item, filter ? filter(commentNode.data) : commentNode.data);
            return;
          }
        }
      },
      // for loading content using scripts that use document.write post-load
      commentFrame: function(item, method, specifiedMethod, filter) {
        var commentNode,
            nodes = item.childNodes,
            i = -1;
        while((commentNode = nodes[++i])) {
          if (commentNode.nodeType == 8) {
            var frame = document.createElement('iframe'),
                condition = item.getAttribute('data-load-condition');
            frame.style.display = 'none';
            if (condition) {
              condition = i$.ns(false, condition);
              if (condition) {
                frame.loadCondition = function() {
                  return condition.call(frame.contentWindow);
                }
              }
            }
            frame.loadHandler = function(content) {
              method(item, filter ? filter(content) : content);
              frame.loadHandler = frame.loadCondition = undefined;
              frame.parentNode.removeChild(frame);
              frame = undefined;
            };
            document.body.appendChild(frame);
            frame.contentWindow.document.open().write("<!DOCTYPE HTML><html><head><script data-loadScript>function handler() {/*alert(window.frameElement);*/ if (!window.frameElement.loadCondition || window.frameElement.loadCondition()) { var df = document.createDocumentFragment(), headNodes = document.getElementsByTagName('head')[0].childNodes, bodyNodes = document.body.childNodes, node, i=0; while (node=headNodes[i]) if (node.nodeType!=1 || node.getAttribute('data-loadScript') == null) { df.appendChild(node) } else { ++i; } i = 0; while(node=bodyNodes[i]) {if (node.nodeType!=1 || node.getAttribute('data-loadScript') == null) { df.appendChild(node) } else { ++i; }} window.frameElement.loadHandler(df);} else { setTimeout(handler, 50); }} if(window.addEventListener){ addEventListener('load', handler, false);} else if (window.attachEvent){attachEvent('onload', handler);}</scr" + "ipt></head><body>" + commentNode.data + (delayedDocumentClose ? "<script data-loadScript>setTimeout(function performClose(runs){if (runs == undefined) runs = 100; if (runs <= 0) return; /*alert(document.body.getElementsByTagName('*').length + ' ' + document.body.getElementsByTagName('script').length);*/ if (document.body.getElementsByTagName('*').length != document.body.getElementsByTagName('script').length) {document.close()} else {setTimeout(function() {performClose(runs-1);}, 2000)}}, 0);</scr" + "ipt>" : "") + "</body></html>");
            if (!delayedDocumentClose) frame.contentWindow.document.close();
            return;
          }
        }
      },
      img: function(item) {
        var dataUrl = item.getAttribute('data-url');
        item.removeAttribute('data-url');
        if (dataUrl) {
          item.src = dataUrl;
          i$.element.forceReflow(item);
        }
      },
      ajax: function(item, method) {
        var url = item.getAttribute('data-url');
        if (url) {
          $.ajax(url, {
            success: function(data) {
              method(item, data);
              item = undefined;
            }
          });
        }
      },
      require: function(item, method, specifiedMethod) {
        var url = item.getAttribute('data-url');
        if (url) {
          if (specifiedMethod) {
            url += i$.callback(function(data) {
              specifiedMethod(item, data);
              item = undefined;
            });
          }
          i$.require({url: url, force: true});
        }
      },
      method: function(item, method, specifiedMethod) {
        specifiedMethod && specifiedMethod(item);
      }
    },
    loadFilters: {
      scriptFilter: function(content) {
        if (typeof content == 'string') {
          var d = document.createElement('div'),
              scripts,
              script;
          d.innerHTML = content;
          scripts = d.getElementsByTagName('script');
          while (script = scripts[0]) {
            script.parentNode.removeChild(script);
          }
          return d.innerHTML;
        } else {
          var nodes = content.childNodes,
              primaryNode,
              childNodes,
              script,
              i = -1,
              j = -1;
          while (primaryNode = nodes[++i]) {
            if (primaryNode.nodeName == 'SCRIPT') {
              content.removeChild(primaryNode);
            } else if (primaryNode.getElementsByTagName && (scripts = primaryNode.getElementsByTagName('script'))) {
              while (script = scripts[++i]) {
                script.parentNode.removeChild(script);
              }
            }
          }
          return content;
        }
      }
    }
  }, old);
  
  old = i$.fn;
  i$.fn = $.extend({
    withinViewport: function(topBuffer, bottomBuffer) {
      return this.filter(function() {
        return i$.element.withinViewport($(this), topBuffer, bottomBuffer);
      });
    },
    loadByHandler: function(type, method) {
      i$.element.loadByHandler(this, type, method);
      return this;
    },
    trigger: function(event) {
      if (!arguments[1]) {
        arguments[1] = this.plugin.name;
      }
      return $.fn.trigger.apply(this, arguments);
    },
    find: function(item) {
      if (item && item.nodeType) {
        return this.getInstance(this.root, [item]);
      } else {
        return $.fn.find.call(this, item);
      }
    },
    to: function(pluginName) {
      return i$.plugins[pluginName].getInstance(this.closest(i$.element.roleSelector(pluginName))[0]);
    },
    as: function(pluginName) {
      return i$.plugins[pluginName].getInstance(this.closest(i$.element.roleSelector(pluginName))[0], this);
    },
    instanceId: function() {
      return i$.getInstanceId(this.plugin, this.root)
    }
  }, old);
  
  (function(direct$) {
    var i = -1,
        method;
    while ((method = direct$[++i])) {
      if ($.fn[method]) i$.fn[method] = (function(fn) {
        return function() {
          return fn.apply(this, arguments);
        };
      })($.fn[method]);
    }
  })('pushStack each sort slice splice push toggleClass addClass removeClass removeAttr removeProp scrollLeft scrollTop data removeData after append domManip appendTo before clone detach empty insertBefore insertAfter prepend prependTo replaceWith unwrap wrap wrapInner wrapAll filter map not attr hasClass html prop val css height width innerHeight innerWidth outerHeight outerWidth offset offsetParent position replaceAll get toArray text parent parents parentsUntil end index size closest children eq add andSelf contents first has is last next nextAll nextUntil prev prevAll prevUntil siblings animate clearQueue delay dequeue fadeIn fadeOut fadeTo fadeToggle hide queue show slideDown slideToggle slideUp stop toggle bind blur change click dblclick delegate die error focus focusin focusout hover keydown keypress keyup live load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup off on one ready resize scroll select submit triggerHandler unbind undelegate unload'.split(' '));
  
  (function() {
    var attributeName,
        attributeNameLowercase,
        attributeNameBy,
        attributeNameSelector,
        attributeNameExpander,
        jQueryMethodName,
        elementMethodName,
        elementMethodAttributeName,
        j = -1,
        k;
        
    while ((attributeName = attributeNames[++j])) {
      
      attributeNameBy = 'By' + attributeName;
      attributeNameLowercase = attributeName.toLowerCase();
      attributeNameSelector = attributeNameLowercase + 'Selector';
      attributeNameExpander = 'expand' + attributeName;
      
      k = -1;
      while ((jQueryMethodName = jQueryMethodNames[++k])) {
        i$.fn[jQueryMethodName + attributeNameBy] = (function(attributeNameSelector, jQueryMethodName) {
          return function(attributeName, pluginName) {
            arguments[0] = (pluginName && i$.plugins[pluginName] ? i$.plugins[pluginName] : this.plugin)[attributeNameSelector](attributeName);
            return this[jQueryMethodName].apply(this, arguments);
          };
        })(attributeNameSelector, jQueryMethodName);
      }
      
      k = -1;
      while ((elementMethodName = elementMethodNames[++k])) {
        i$.fn[(elementMethodAttributeName = elementMethodName + attributeName)] = (function(attributeNameExpander, elementMethodAttributeName, elementMethodName) {
          if (elementMethodName == 'has') {
            return function(attributeName, pluginName) {
              var args = Array.prototype.slice.call(arguments);
              args[0] = (pluginName && i$.plugins[pluginName] ? i$.plugins[pluginName] : this.plugin)[attributeNameExpander](attributeName);
              args.unshift(null);
              return this.filter(function(i, element) {
                args[0] = element
                return i$.element[elementMethodAttributeName].apply(element, args);
              });
            };
          } else {
            return function(attributeName, pluginName) {
              var args = Array.prototype.slice.call(arguments);
              args[0] = (pluginName && i$.plugins[pluginName] ? i$.plugins[pluginName] : this.plugin)[attributeNameExpander](attributeName);
              args.unshift(this);
              i$.element[elementMethodAttributeName].apply(this, args);
              return this;
            };
          }
        })(attributeNameExpander, elementMethodAttributeName, elementMethodName);
      }
      
      i$.fn[attributeNameLowercase + 's'] = (function(attributeName) {
        return function(pluginName) {
          var element = this[0],
              items = [],
              item,
              index,
              attr,
              dataAttrPrefix,
              i = -1;
          if (!pluginName) pluginName = this.plugin.name
          if (element) {
            if ((attr = element.getAttribute('data-' + attributeName)) && (attr = attr.split(rSpaceGlobal)).length) {
              while ((item = attr[++i])) {
                if (item == pluginName) {
                  items.push('root');
                } else if ((index = item.indexOf((dataAttrPrefix = pluginName + '_'))) === 0) {
                  items.push(item.substring(dataAttrPrefix.length));
                }
              }
            }
          }
          return items;
        }
      })(attributeName);
    }
  })();
  
  old = i$.plugins;
  i$.plugins = {
    loadfor: {
      name: 'loadfor',
      handlers: {
        defaults: {
          item: function(event, element) {
            this.load(element);
          },
          cancel: function(event, element) {
            this.cancel(element);
          }
        }
      },
      fn: {
        load: function(loadingElement) {
          var forRole = loadingElement.getAttribute('data-loadfor-role'),
              $items;
          
          if (forRole) {
              $items = this.find(i$.element.roleSelector(forRole));
              if ($items.length) {
                $items.removeRole(forRole).loadByHandler();
              }
          } else {
            i$.element.loadByHandler(loadingElement);
          }
          return this;
        },
        cancel: function(loadingElement) {
          i$.element.removeRole(loadingElement, 'loadfor_item loadfor_cancel');
          loadingElement.removeAttribute('data-loadfor-role');
          return this;
        }
      },
      events: 'click loadfor'
    },
    base: {
      name: 'base',
      global: true,
      handlers: {
        defaults: {},
        click: {}
      },
      events: 'click'
    }
  };
  
  (function initializeDelayload() {
    
    var loadHandler = {
          root: function() {
            this.load();
          }
        },
        loadGuard = {
          root: function(event, root, element) {
            if (!this.info.loadEventsCancelled) {
              this.info.loadEventsCancelled = true;
              this.cancelEvents('poll@250 document_ready');
            }
            return i$.element.withinViewport($(element), 500, 500);
          }
        };
    
    i$.plugins.delayload = {
      name: 'delayload',
      handlers: {
        timedscroll: loadHandler,
        document_ready: loadHandler,
        poll: loadHandler
      },
      guards: {
        timedscroll: loadGuard,
        document_ready: loadGuard,
        poll: {
          root: function(event, root, element) {
            return i$.element.withinViewport($(element), 500, 500);
          }
        }
      },
      fn: {
        load: function(event) {
          var $done,
              $items = this.findByRole('item'),
              notPersisted = !this.info.options.persist;
              
          if (notPersisted) this.removeRole('root')
          if ($items.length) {
            if (notPersisted) $items.removeRole('item');
            $items.loadByHandler();
          } else {
            $items[0] = this[0];
            $items.length = 1;
            var element = $items[0],
                parent = element.parentNode,
                nodes = parent.childNodes,
                length = nodes.length,
                index = -1,
                end,
                items = [],
                item,
                i = -1;
            while (nodes[++index] != element);
            
            $items.loadByHandler();
            
            end = nodes.length - (length - index) + 1;
            while (index < end && (item = nodes[index++])) {
              items.push(item);
            }
            for (; item = items[++i];) {
              $items[i] = item;
            }
            $items.length = items.length
          }
          
          if ($done = i$.element.hasRole($items, 'delayload_done') ? $items : $items.findByRole('done')) {
            if (notPersisted) $done.removeRole('done');
            $done.trigger('delayload_done');
          }
          return this;
        }
      },
      events: 'timedscroll poll@250 document_ready',
      info: {}
    };
    loadHandler = undefined;
  })();
  
  $.extend(true, i$.plugins, old);
  
  // auto-register these modules
  i$('base');
  i$('loadfor');

})(window, window.jQuery);


}
/*
     FILE ARCHIVED ON 20:06:09 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:53 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.631
  exclusion.robots: 0.041
  exclusion.robots.policy: 0.026
  esindex: 0.013
  cdx.remote: 14.68
  LoadShardBlock: 68.72 (3)
  PetaboxLoader3.datanode: 149.109 (4)
  load_resource: 146.187
  PetaboxLoader3.resolve: 52.18
*/