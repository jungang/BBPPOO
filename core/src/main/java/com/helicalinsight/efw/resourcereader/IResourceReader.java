/**
 *    Copyright (C) 2013-2019 Helical IT Solutions (http://www.helicalinsight.com) - All rights reserved.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package com.helicalinsight.efw.resourcereader;

import com.helicalinsight.efw.exceptions.ApplicationException;
import com.helicalinsight.efw.exceptions.ImproperXMLConfigurationException;
import com.helicalinsight.efw.exceptions.UnSupportedRuleImplementationException;
import net.sf.json.JSONObject;

/**
 * This interface has been changed to to be able to accept multiple extensions
 * and multiple xsd file types. Earlier only one extension and xsd were used.
 * <p/>
 * Its implementations XMLResourceReader and JSONResourceReader have also been
 * changed accordingly.
 *
 * @author Muqtar Ahmed
 * @author Rajasekhar
 * @author Avi
 */

public interface IResourceReader {

    public String getResources() throws ApplicationException, UnSupportedRuleImplementationException,
            ImproperXMLConfigurationException;

    public String getPath();

    public void setPath(String path);

    public JSONObject getVisibleExtensions();

    public void setVisibleExtensions(JSONObject visibleExtensions);
}